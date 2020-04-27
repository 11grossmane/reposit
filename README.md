# reposit

[![Build Status](https://travis-ci.org/11grossmane/reposit.svg?branch=master)](https://travis-ci.org/11grossmane/reposit)

> Create remote repositories from the command line

![reposit-screenshot](https://github.com/11grossmane/reposit/blob/master/reposit-example-usage-edited.png?raw=true)

## Install

```bash
npm i -g reposit
```

## Usage

> \*\*Note: reposit currently only supports Github and Bitbucket,
> and therefore must be run with -g flag, or -b flag
- -b create bitbucket repo
- -g create github repo
- -r reset login credentials
- -d delete repo (use with -g or -b to specify provider) 

#### Create Github Repo

```bash
reposit -g
```

#### Create Bitbucket Repo

```bash
reposit -b
```

#### Deleting Github Repo

```bash
reposit -g -d
```

#### Deleting Bitbucket Repo

```bash
reposit -b -d
```

#### Resetting Login Information

> When you run reposit for the first time with -g or -b, it will take you through a flow where you add your login information, which is then cached on your machine so you don't have to log in everytime. But if you want to reset your info, just run reposit with the -r flag

###### Example

```bash
reposit -g -r
```

## License

[MIT](http://vjpr.mit-license.org)
