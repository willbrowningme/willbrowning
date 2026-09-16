---
title: Sharing Cookies with Subdomains in Laravel
title_slug: sharing-cookies-with-subdomains-in-laravel
published: true
created: 2018-10-26T08:27:04.000Z
modified: 2019-07-17T14:13:57.000Z
meta_description: Sometimes it can be useful for a subdomain such as app.example.com to have access to the cookies that are set by example.com. A situation where this could be used would be for a very simple referral tracking system, where example.com sets a cookie if there is a query string present in the URL. Then when the user registers on app.example.com this cookie is retrieved and the data regarding who referred that user is stored in the database.
image: /images/posts/5bd2d2f5c7477example.test.png
tags:
  - laravel
---

## Setting up Our Example Sites

For this example I'll be using [Laravel Homestead](https://laravel.com/docs/5.7/homestead) to set up a couple of local Laravel sites.

```bash
laravel new example && laravel new subdomain
```

Then we need to edit Homestead.yaml and our hosts file to add addresses for these applications.

```yaml
sites:
    - map: example.test
      to: /home/vagrant/code/example/public/
    - map: app.example.test
      to: /home/vagrant/code/subdomain/public/
```

```txt
192.168.10.10 example.test
192.168.10.10 app.example.test
```

```bash
homestead up --provision
```

When you've provisioned Homestead you should see the new Laravel welcome screen when you visit `example.test` and `app.example.test`.

<div class="blog-image">
    
![New Laravel App](/images/posts/5bd2d2f5c7477example.test.png) 
</div>

## Updating our Environment Variables

Let's edit our `.env` file for our main example.test site. Update the following values.

```env
APP_URL=http://example.test
SESSION_DOMAIN=.example.test
```

The `SESSION_DOMAIN` variable is important as this will allow our subdomain to access all cookies set by the parent domain.

Now let's also update the `.env` file for our app.example.test site.

```env
APP_URL=http://app.example.test
```

We don't need to set `SESSION_DOMAIN` here.

We've left `SESSION_DRIVER` as the default value which is file for both sites.

## Saving our Cookie

In our main `example.test` code update the default welcome route in `web.php`.

```php
Route::get('/', function () {
    Cookie::queue(Cookie::make('test', 'abc', 60));

    return view('welcome');
});

Route::get('/cookie', function () {
    return Cookie::get('test');
});
```

Here we're informing Laravel to set a Cookie named 'test' with a value of 'abc' that will expire in 60 minutes.

First visit `example.test` in your browser, then if you visit `example.test/cookie` you should see the value we set of `abc`. So we know that our Cookie has been succesfully set.

## Accessing our Cookie on our Subdomain

If you head over to your `app.example.test` code and add the following to the web.php routes file:

```php
Route::get('/cookie', function () {
    return Cookie::get('test');
});
```
Then visit `app.example.test/cookie` you won't be able to see anything yet as Laravel by default [encrypts all cookies](https://laravel.com/docs/5.7/responses#cookies-and-encryption) that are set.

There are a couple of options we have here on how to access the cookie.

1. **Use the same APP_KEY value for both sites**


We can copy the APP_KEY value from our example.test .env file and paste it in our app.example.test .env file so that they both have the same value. If you try this and then visit again `app.example.test/cookie` you will be able to see the value `abc` and the cookie can be decrypted succsesfully. 

The reason this works is because Laravel uses our APP_KEY value when encrypting, decrypting and signing data.

Some people may feel uncomfortable having the same APP_KEY value for both sites but there is another way.

2. **Disable encryption for the cookie in question**


We can tell Laravel not to encrypt certain cookies if they do not contain sensitive data.

In **`both`** of our sites open up the `app/Http/Middleware` folder and edit the `EncryptCookies.php` file.

```php
protected $except = [
	'test'
];
```

Here we can add the name of any cookies we don't wish to be encrypted. Make sure you've added this to `both sites`.

Change the value of the cookie set by `example.test` to something else so we can be sure it's working.

```php
Cookie::queue(Cookie::make('test', '123', 60));
```

Then visit `example.test` in your browser again. Check `example.test/cookie` and you should see the value of '123' this time.

Now if you visit `app.example.test/cookie` you should be able to access the cookie and see the value of '123' returned.

You should only disable encryption for a cookie if it contains non-sensitive information.

## Sharing Cookies for a Simple Referral System

I'll write another post shortly detailing how we can use what we've applied here to create a very simple referral system that tracks who has been referred by who. The system will use middleware to determine whether to set a cookie if a certain query string is present in the request. This will enable you to link to any url on your main site like so `example.test/?ref=referral-id` or `example.test/pricing?ref=referral-id`.

`Update:` You can find the simple referral system post here - [Building a Simple Referral System in Laravel](https://willbrowning.me/building-a-simple-referral-system-in-laravel/)


