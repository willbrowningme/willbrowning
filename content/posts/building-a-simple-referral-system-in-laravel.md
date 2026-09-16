---
title: Building a Simple Referral System in Laravel
title_slug: building-a-simple-referral-system-in-laravel
published: true
created: 2018-10-26T10:23:49.000Z
modified: 2019-08-08T18:53:01.000Z
meta_description: "In this post we'll carry on from the previous one regarding sharing cookies with a subdomain and use what we learned to build a simple referral system to track who has referred users when they register on the site."
image: /images/posts/5bd2eaf94690bregister-example.png
tags:
  - laravel
---

This post is a continuation of [Sharing Cookies with Subdomains in Laravel](https://willbrowning.me/sharing-cookies-with-subdomains-in-laravel/) so if you have not read that please go and check it out.

## Adding Authentication to our Subdomain

In the example we're making here I'll be adding authentication to `app.example.test` and we'll be treating `example.test` as the marketing frontend for our application.

So let's edit our Homestead.yaml file and add a database we can use for our authentication.

```yaml
databases:
    - example
```

Then run `homestead up --provision` or `homestead reload --proivision` if homestead is already running.

Now we need to ssh into homestead so run `homestead ssh` and navigate to the directory where `app.example.test` is located. Then run the following:

```bash
php artisan make:auth
```

You should now be able to see the login and register pages.

<div class="blog-image">
    
![Register Example](/images/posts/5bd2eaf94690bregister-example.png) 
</div>

## Creating Middleware to Set our Cookie

In our `example.test` code create some new Middleware called `CheckReferral`.

```bash
php artisan make:middleware CheckReferral
```

Open up the newly created file and edit the handle function.

```php
public function handle($request, Closure $next)
{
	if( !$request->hasCookie('referral') && $request->query('ref') ) {
        return redirect($request->url())->withCookie(cookie()->forever('referral', $request->query('ref')));
    }

    return $next($request);
}
```

What we are doing here is checking whether a cookie named `referral` is currently set. If it is not and the request contains a query parameter `ref` then Laravel will set a cookie named referral with the value of whatever ref is equal to that has the maximum expiry time.

For example the url `example.test/?ref=laravel` would set a cookie (if none already exists) with value `laravel`.

If we want this middleware to run during every web route HTTP request to our application then we can add it to our middleware by editing `app/Http/Kernel.php` and adding it to the 'web' section of the $middlewareGroups property like so:

```php
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        // \Illuminate\Session\Middleware\AuthenticateSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        \App\Http\Middleware\CheckReferral::class,
    ],

    'api' => [
        'throttle:60,1',
        'bindings',
    ],
];
```

If you only wanted to check and set the cookie on the homepage you could simply add it to the $routeMiddleware property instead and then call it for the `'/'` route in web.php.

## Checking our Cookie is Being Set

If you remember from the previous post we had a route `/cookie` to check if the cookie had been set. Let's edit web.php and update this:

```php
Route::get('/', function () {
    //Cookie::queue(Cookie::make('test', '123', 60));

    return view('welcome');
});

Route::get('/cookie', function () {
    return Cookie::get('referral');
});
```

Make sure to comment out or delete the Cookie::queue we added in the previous post as we don't need this anymore.

Now if we visit `example.test/?ref=laravel` you'll notice we're redirected to `example.test`.

If we go to `example.test/cookie` then you should see the value laravel returned.

Our cookie is currently being encrypted by Laravel but since it does not contain sensitive data lets disable it by editing `app/Http/Middleware/EncryptCookies.php`.

```php
protected $except = [
     'referral'
 ];
```

Make sure to update `EncryptCookies.php` for app.example.test too.

## Registering a User and Generating a Referral ID

Head over to your code for `app.example.test` and then register a new user in your browser.

Login with your newly created user. We'll be using a packaged called [hashids](https://github.com/vinkla/laravel-hashids) that has been ported to Laravel to create a short unique string based on our users' ID in the database.

So install the package by running the following:

```bash
composer require vinkla/hashids
```

It should be discovered automatically. Next add the Facade to our aliases list at the bottom of config/app.php

```php
'Hashids' => Vinkla\Hashids\Facades\Hashids::class,
```

Now we can publish the vendor files by running:

```php
php artisan vendor:publish --provider="Vinkla\Hashids\HashidsServiceProvider"
```

Open up `config/hashids.php` and update the 'main' connection. You can use laravel to generate a random string for the salt, just temporarily add `dd(str_random(40));` to any route in web.php.

```php
'main' => [
    'salt' => 'yGPMa8oZc7PEJXxEnOIAhZscjujizzCPt028vCSG',
    'length' => 6,
],
```

Now we will be able to generate a unique 6 character long referral ID for each user based on their ID in the database.

Create a new route in web.php called `referral-link`.

```php
Route::get('/referral-link', 'HomeController@referral');
```

We are using the HomeController generated by Laravel's auth scaffolding as it already has the auth middleware.

Edit HomeController.php:

```php
public function referral()
{
    return 'http://example.test/?ref=' . \Hashids::encode(auth()->user()->id);
}
```

You should see something like this `http://example.test/?ref=V53YMO` returned.

## Checking for the Cookie When Registering New Users

First let's create a new migration to add a new column to our database.

```bash
php artisan make:migration add_referred_by_column_to_users_table --table=users
```

Edit the new migration file in `database/migrations` 

```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->unsignedInteger('referred_by')->nullable()->after('email');
    });
}
```

Then whilst inside Homestead and in the correct directory run `php artisan migrate`.

There will now be a referred_by column right after the email column in the users table.

Now we just need to edit `app/Http/Controllers/Auth/RegisterController.php` so we can save the referred by data.

```php
use Illuminate\Support\Facades\Cookie;
```

Make sure to add that to the top of the file first, then update the create function:

```php
protected function create(array $data)
{
    $cookie = Cookie::get('referral');

	$referred_by = $cookie ? \Hashids::decode($cookie)[0] : null;

    return User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => Hash::make($data['password']),
        'referred_by' => $referred_by
    ]);
}
```

We check if the cookie named `referral` is set (if it is not then null is returned) then we use our Hashids package to decode the value in the cookie and give us the ID of the user who referred this new registration.

Hashids::decode() returns an array which is why we have to add [0].

Before we continue make sure to update `app/User.php` to add 'referred_by' to the $fillable property.

```php
protected $fillable = [
    'name', 'email', 'password', 'referred_by'
];
```

## Testing it out With a New User Registration

Before you log out of the current user visit `app.example.test/referral-link` and copy your referral link.

Then log out and make sure to clear all your cookies for both `example.test` and `app.example.test`. Then paste your referral link into the browser (e.g. [http://example.test/?ref=V53YMO](http://example.test/?ref=V53YMO)).

Then imagine that we click a button on `example.test` that takes us to `app.example.test/register` for us to sign up for the application.

Enter details for a new user and click `Register`. If you now check out the records in the database table you should see the referred_by column for this new user contains the id of the first user you created.

We can create a relationship that returns users who you have referred.

Update `app/User.php` and add the following to the bottom of the file.

```php
public function referrer()
{
    return $this->belongsTo('App\User', 'referred_by');
}

public function referrals()
{
    return $this->hasMany('App\User', 'referred_by');
}
```

Then update your web.php routes file.

```php
Route::get('/referrer', 'HomeController@referrer');
Route::get('/referrals', 'HomeController@referrals');
```

And finally HomeController.php

```php
public function referrer()
{
    return auth()->user()->referrer;
}

public function referrals()
{
    return auth()->user()->referrals;
}
```

Now if you login as your first user and visit `app.example.test/referrals` you'll see an array of all the users who you've referred to the site.

If you visit `app.example.test/referrer` you'll see the details of the user who referred you to the site.

Obviously we would never do this in a production application but things like `auth()->user()->referrals()->count()` could be useful.

## Closing Thoughts

This is only a very simple example but hopefully it gives you a basic idea of how a more complex system could be implemented. If you are using the same domain for marketing and registrations then you can skip all the cookie sharing stuff and keep your cookies encrypted.

Source code for both sites can be found here [https://github.com/willbrowningme/laravel-user-referral-example](https://github.com/willbrowningme/laravel-user-referral-example).
