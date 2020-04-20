# reposit

> Create remote repositories from the command

## Install

```bash
npm i -g reposit
```

## Usage

> \*\*Note: reposit currently only supports Github and Bitbucket,
> and therefore must be run with -g flag, or -b flag

#### Create Github Repo

```bash
reposit -g
```

#### Create Bitbucket Repo

```bash
reposit -b
```

#### Screenshot

![reposit-screenshot](reposit-example-usage-edited.png)

#### Resetting Login Information

> When you run reposit for the first time with -g or -b, it will take you through a flow where you add your login information, which is then cached on your machine so you don't have to log in everytime. But if you want to reset your info, just run reposit with the -r flag

###### Example

```bash
reposit -g -r
```

## License

[MIT](http://vjpr.mit-license.org)
