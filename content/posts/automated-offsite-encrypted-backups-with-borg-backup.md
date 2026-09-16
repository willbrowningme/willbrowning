---
title: Automated Offsite Encrypted Backups with Borg Backup
title_slug: automated-offsite-encrypted-backups-with-borg-backup
published: true
created: 2019-06-25T13:02:59.000Z
modified: 2019-10-30T09:07:03.000Z
meta_description: "In this post I'll be showing you how to set up Borg Backup to backup the important files on your VPS or local work station to a remote repository. For this tutorial I'm going to be using borgbase.com as the remote repository provider but there are other options you can choose."
image: /images/posts/5d121b2f717a4borgbase-repo.png
tags:
  - backups
---

[Borgbase.com](https://borgbase.com) was created specifically to host Borg repositories, it has a nice free plan that gives you 5GB of storages and allows upto 2 repositories. If you have a small VPS then this might be enough for you.

If you don't want to use borgbase you could use [rysnc.net](https://www.rsync.net/products/attic.html) or even another VPS that you run.

This tutorial will be done on a fresh Digital Ocean droplet with Ubuntu 18.04. 

Commands will be run by a user named johndoe with sudo privileges.

## Install Borg Backup

First things first we need to install Borg, luckily we can find it in Ubuntu's software repositories.

```bash
sudo apt update
sudo apt install borgbackup
```

You can check everything worked correctly by running `borg --version`, you should see something like `borg 1.1.5`, which is the version at the time of writing this post.

## Install Python 3 and PIP

Now we need to install Python 3 along with PIP so that we can install Borgmatic.

Borgmatic is a wrapper for Borg that allows us to manage backups with easy to use configuration files. It is not required to use Borg but I'm going to use it here to show you how it works.

You may already have Python 3 installed (I think 18.04 does by default). You can run the commands below to check.

```bash
python --version
python3 --version
```

If Python 3 is already installed check what version of Python PIP is currently using, it might not be installed at all.

```bash
pip --version
pip3 --version
```

If PIP returns (python 2.7) at the end or it is not installed at all then we need to install PIP for Python 3.

```bash
sudo apt install python3-pip python3-setuptools
```

Make sure everything was installed correctly by running `pip3 --version`.

Next install the following package that is used by Borgmatic.

```bash
pip3 install wheel
```

## Install Borgmatic

Using PIP install Borgmatic for your user (johndoe in my case).

```bash
pip3 install --user --upgrade borgmatic
```

You may need to edit your `~/.bashrc` file to include these commands in your PATH by adding the following to the end of the file.

```
export PATH="$HOME/.local/bin:$PATH"
```

Then running `source ~/.bashrc` to update it for your current session.

Next we can publish the default configuration file by running the following.

```bash
sudo env "PATH=$PATH" generate-borgmatic-config
```

The reason we pass `env "PATH=$PATH"` is to make sure we still have the borgmatic commands in our PATH when running sudo.

We could edit the `secure_path` in /etc/sudoers to include /home/johndoe/.local/bin but I'll leave it as it is for this tutorial.

Before we go and edit the config file we'll first generate a new key pair and create our remote repository in borgbase.

## Generate New ssh Key Pair

To generate the key pair run the following command:

```bash
ssh-keygen -t ed25519 -a 100
```

Call it `/home/johndoe/.ssh/borg_id_ed25519` making sure to replace `johndoe` with the your username and leave the passphrase as empty.

This will generate an Ed25519 key, which is shorter and faster than a comparable RSA key.

```bash
cat ~/.ssh/borg_id_ed25519.pub
```

Copy this **public** key and add it to your BorgBase account by clicking "ACCOUNT" and then "ADD KEY". 

## Create Repository in BorgBase

Give it a name you'll recognise for your server and add the new key above to the Append-only access section.

<div class="blog-image">

![BorgBase Repository](/images/posts/5d121b2f717a4borgbase-repo.png)
</div>

Copy the repo path as we'll be adding it to the config file next, it will be something like `c89dks9m@c89dks9m.repo.borgbase.com:repo`.

## Editing the Config File

Open /etc/borgmatic/config.yaml by running `sudo nano /etc/borgmatic/config.yaml` and edit its contents to look something like this:

```yaml
# Where to look for files to backup, and where to store those backups. See
# https://borgbackup.readthedocs.io/en/stable/quickstart.html and
# https://borgbackup.readthedocs.io/en/stable/usage.html#borg-create for details.
location:
    # List of source directories to backup (required). Globs and tildes are expanded.
    source_directories:
        - /root
        - /home
        - /etc
        - /var/log/syslog*

    # Paths to local or remote repositories (required). Tildes are expanded. Multiple
    # repositories are backed up to in sequence. See ssh_command for SSH options like
    # identity file or port.
    repositories:
        - YOUR-REPO-ID@YOUR-REPO-ID.repo.borgbase.com:repo

    # Stay in same file system (do not cross mount points). Defaults to false.
    #one_file_system: true

    # Only store/extract numeric user and group identifiers. Defaults to false.
    #numeric_owner: true

    # Use Borg's --read-special flag to allow backup of block and other special
    # devices. Use with caution, as it will lead to problems if used when
    # backing up special devices such as /dev/zero. Defaults to false.
    #read_special: false

    # Record bsdflags (e.g. NODUMP, IMMUTABLE) in archive. Defaults to true.
    #bsd_flags: true

    # Mode in which to operate the files cache. See
    # https://borgbackup.readthedocs.io/en/stable/usage/create.html#description for
    # details. Defaults to "ctime,size,inode".
    #files_cache: ctime,size,inode

    # Alternate Borg local executable. Defaults to "borg".
    #local_path: borg1

    # Alternate Borg remote executable. Defaults to "borg".
    #remote_path: borg1

    # Any paths matching these patterns are included/excluded from backups. Globs are
    # expanded. (Tildes are not.) Note that Borg considers this option experimental.
    # See the output of "borg help patterns" for more details. Quote any value if it
    # contains leading punctuation, so it parses correctly.
    #patterns:
    #    - R /
    #    - '- /home/*/.cache'
    #    - + /home/susan
    #    - '- /home/*'

    # Read include/exclude patterns from one or more separate named files, one pattern
    # per line. Note that Borg considers this option experimental. See the output of
    # "borg help patterns" for more details.
    #patterns_from:
    #    - /etc/borgmatic/patterns

    # Any paths matching these patterns are excluded from backups. Globs and tildes
    # are expanded. See the output of "borg help patterns" for more details.
    exclude_patterns:
        - '*.pyc'
        - ~/*/.cache
    #    - /etc/ssl

    # Read exclude patterns from one or more separate named files, one pattern per
    # line. See the output of "borg help patterns" for more details.
    #exclude_from:
    #    - /etc/borgmatic/excludes

    # Exclude directories that contain a CACHEDIR.TAG file. See
    # http://www.brynosaurus.com/cachedir/spec.html for details. Defaults to false.
    exclude_caches: true

    # Exclude directories that contain a file with the given filename. Defaults to not
    # set.
    exclude_if_present: .nobackup

# Repository storage options. See
# https://borgbackup.readthedocs.io/en/stable/usage.html#borg-create and
# https://borgbackup.readthedocs.io/en/stable/usage/general.html#environment-variables for
# details.
storage:
    # The standard output of this command is used to unlock the encryption key. Only
    # use on repositories that were initialized with passcommand/repokey encryption.
    # Note that if both encryption_passcommand and encryption_passphrase are set,
    # then encryption_passphrase takes precedence. Defaults to not set.
    #encryption_passcommand: secret-tool lookup borg-repository repo-name

    # Passphrase to unlock the encryption key with. Only use on repositories that were
    # initialized with passphrase/repokey encryption. Quote the value if it contains
    # punctuation, so it parses correctly. And backslash any quote or backslash
    # literals as well. Defaults to not set.
    encryption_passphrase: CHANGE-ME-TO-A-LONG-SECURE-PASSPHRASE

    # Number of seconds between each checkpoint during a long-running backup. See
    # https://borgbackup.readthedocs.io/en/stable/faq.html#if-a-backup-stops-mid-way-does-the-already-backed-up-data-stay-there
    # for details. Defaults to checkpoints every 1800 seconds (30 minutes).
    #checkpoint_interval: 1800

    # Specify the parameters passed to then chunker (CHUNK_MIN_EXP, CHUNK_MAX_EXP,
    # HASH_MASK_BITS, HASH_WINDOW_SIZE). See https://borgbackup.readthedocs.io/en/stable/internals.html
    # for details. Defaults to "19,23,21,4095".
    #chunker_params: 19,23,21,4095

    # Type of compression to use when creating archives. See
    # https://borgbackup.readthedocs.org/en/stable/usage.html#borg-create for details.
    # Defaults to "lz4".
    compression: auto,zstd

    # Remote network upload rate limit in kiBytes/second. Defaults to unlimited.
    #remote_rate_limit: 100

    # Command to use instead of "ssh". This can be used to specify ssh options.
    # Defaults to not set.
    ssh_command: ssh -i /home/johndoe/.ssh/borg_id_ed25519

    # Base path used for various Borg directories. Defaults to $HOME, ~$USER, or ~.
    # See https://borgbackup.readthedocs.io/en/stable/usage/general.html#environment-variables for details.
    #borg_base_directory: /path/to/base

    # Path for Borg configuration files. Defaults to $borg_base_directory/.config/borg
    #borg_config_directory: /path/to/base/config

    # Path for Borg cache files. Defaults to $borg_base_directory/.cache/borg
    #borg_cache_directory: /path/to/base/cache

    # Path for Borg security and encryption nonce files. Defaults to $borg_base_directory/.config/borg/security
    #borg_security_directory: /path/to/base/config/security

    # Path for Borg encryption key files. Defaults to $borg_base_directory/.config/borg/keys
    #borg_keys_directory: /path/to/base/config/keys

    # Umask to be used for borg create. Defaults to 0077.
    #umask: 0077

    # Maximum seconds to wait for acquiring a repository/cache lock. Defaults to 1.
    #lock_wait: 5

    # Name of the archive. Borg placeholders can be used. See the output of
    # "borg help placeholders" for details. Defaults to
    # "{hostname}-{now:%Y-%m-%dT%H:%M:%S.%f}". If you specify this option, you must
    # also specify a prefix in the retention section to avoid accidental pruning of
    # archives with a different archive name format. And you should also specify a
    # prefix in the consistency section as well.
    archive_name_format: '{hostname}-{now}'

# Retention policy for how many backups to keep in each category. See
# https://borgbackup.readthedocs.org/en/stable/usage.html#borg-prune for details.
# At least one of the "keep" options is required for pruning to work. See
# https://torsion.org/borgmatic/docs/how-to/deal-with-very-large-backups/
# if you'd like to skip pruning entirely.
retention:
    # Keep all archives within this time interval.
    #keep_within: 3H

    # Number of secondly archives to keep.
    #keep_secondly: 60

    # Number of minutely archives to keep.
    #keep_minutely: 60

    # Number of hourly archives to keep.
    #keep_hourly: 24

    # Number of daily archives to keep.
    keep_daily: 7

    # Number of weekly archives to keep.
    keep_weekly: 4

    # Number of monthly archives to keep.
    keep_monthly: 6

    # Number of yearly archives to keep.
    keep_yearly: 1

    # When pruning, only consider archive names starting with this prefix.
    # Borg placeholders can be used. See the output of "borg help placeholders" for
    # details. Defaults to "{hostname}-".
    prefix: '{hostname}-'

# Consistency checks to run after backups. See
# https://borgbackup.readthedocs.org/en/stable/usage.html#borg-check and
# https://borgbackup.readthedocs.org/en/stable/usage.html#borg-extract for details.
consistency:
    # List of one or more consistency checks to run: "repository", "archives", and/or
    # "extract". Defaults to "repository" and "archives". Set to "disabled" to disable
    # all consistency checks. "repository" checks the consistency of the repository,
    # "archive" checks all of the archives, and "extract" does an extraction dry-run
    # of the most recent archive.
    checks:
        - repository
        - archives

    # Paths to a subset of the repositories in the location section on which to run
    # consistency checks. Handy in case some of your repositories are very large, and
    # so running consistency checks on them would take too long. Defaults to running
    # consistency checks on all repositories configured in the location section.
    #check_repositories:
    #    - user@backupserver:sourcehostname.borg

    # Restrict the number of checked archives to the last n. Applies only to the "archives" check. Defaults to checking all archives.
    check_last: 3

    # When performing the "archives" check, only consider archive names starting with
    # this prefix. Borg placeholders can be used. See the output of
    # "borg help placeholders" for details. Defaults to "{hostname}-".
    prefix: '{hostname}-'

# Options for customizing borgmatic's own output and logging.
#output:
    # Apply color to console output. Can be overridden with --no-color command-line
    # flag. Defaults to true.
    #color: false

# Shell commands or scripts to execute before and after a backup or if an error has occurred.
# IMPORTANT: All provided commands and scripts are executed with user permissions of borgmatic.
# Do not forget to set secure permissions on this file as well as on any script listed (chmod 0700) to
# prevent potential shell injection or privilege escalation.
hooks:
    # List of one or more shell commands or scripts to execute before creating a backup.
    before_backup:
        - echo "`date` - Starting backup"
        - mysqldump --all-databases > /home/johndoe/databases.sql

    # List of one or more shell commands or scripts to execute after creating a backup.
    after_backup:
        - echo "`date` - Finished backup"
        - rm /home/johndoe/databases.sql

    # List of one or more shell commands or scripts to execute in case an exception has occurred.
    #on_error:
    #    - echo "Error while creating a backup."

    # Umask used when executing hooks. Defaults to the umask that borgmatic is run with.
    #umask: 0077
```

Make sure to change the encryption passphrase to a long secure secret and also update the repository addresss. Change the files to backup to suit your specific needs.

If you want to include your databases in the backup then you can use the before and after hooks (make sure again to change johndoe to the name of your user). If not then just comment out these lines. 

Make sure to backup your passphrase as you won't be able to decrypt your backups without it.

Run the following command to check for any configuration errors.

```bash
sudo env "PATH=$PATH" validate-borgmatic-config
```

If everything is okay you should see `All given configuration files are valid: /etc/borgmatic/config.yaml`.

## Initialise the Backup Repository

```bash
sudo env "PATH=$PATH" borgmatic init --encryption repokey-blake2
```

You'll be asked about the authenticity of the host when connecting for the first time. Check the ECDSA key fingerprint against the one shown in BorgBase by hovering over the fingerprint icon on the repository check the SHA256 to make sure it matches.

Then enter yes to continue. You'll see a message saying Repository .... does not exist. This is simply becuase it it the first time you are running the command and it is currently being created.

## Creating your First Backup

To create our first backup we can simply run the following:

```bash
sudo env "PATH=$PATH" borgmatic --verbosity 1
```

The verbosity flag simply tells Borgmatic to print out all the files it is adding, quickly check through the list to make sure they all look correct as per your /etc/borgmatic/config.yaml file.

## Automating Backups with a Cron Job

Since we're using sudo to run borgmatic we need to edit our /etc/sudoers file to allow passwordless sudo for that particular command whilst running our cron job.

```bash
sudo visudo
```

At the end of the file add the following:

```
johndoe ALL=(root) NOPASSWD: /home/johndoe/.local/bin/borgmatic
```

This will allow us to run our cron job with sudo and not be prompted for a sudo password.

To add a new cron job type `crontab -e` in the terminal.

Add the following line to the end of the file.

```
0 0 * * * sudo /home/johndoe/.local/bin/borgmatic
```

This will create a new backup everyday at midnight.

## Multiple Repositories for Differents Apps

If you would like to separate your apps in different repositories or even to create a repository for backing up just your database you can create a new config file by running:

```bash
sudo env "PATH=$PATH" generate-borgmatic-config --destination /etc/borgmatic.d/app1.yaml
```

You can then go and update the new config file to your liking e.g. to make an hourly database backup.

When setting up cron jobs for backups as above you can pass `--config /etc/borgmatic.d/app1.yaml` to tell Borgmatic to only run the backup for that repository.

```
0 * * * * sudo /home/johndoe/.local/bin/borgmatic --config /etc/borgmatic.d/app1.yaml
```

This will run our app1 config file every hour.

## Checking Backups

To see all of your backup archives you can run:

```bash
sudo env "PATH=$PATH" borgmatic list
```

To see details about usage and the size of archives you can run:

```bash
sudo env "PATH=$PATH" borgmatic info
```

## Restoring Backups

To restore a backup you need to first get the name of the archive using the above `borgmatic list` command.

The list command should display something like this:

```
host-2019-01-01T04:05:06.070809      Tue, 2019-01-01 04:05:06 [...]
host-2019-01-02T04:06:07.080910      Wed, 2019-01-02 04:06:07 [...]
```

Then you can simply run:

```bash
sudo env "PATH=$PATH" borgmatic extract --archive host-2019-01-02T04:06:07.080910
```

You can also extract specific files by running:

```bash
sudo env "PATH=$PATH" borgmatic extract --archive host-2019-01-02T04:06:07.080910 --restore-path /path/1 /path/2
```

More information about extracting repositories and individual files can be found here - https://torsion.org/borgmatic/docs/how-to/restore-a-backup/

Borg has many more great features you can read about in the official docs here - https://borgbackup.readthedocs.io/en/stable/

Hopefully this has given you a quick overview regarding Borg's features and how simple it can be to set up.


