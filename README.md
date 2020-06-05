# halp-cli
A CLI for you to query StackOverflow from the comfort of your own terminal. The idea behind the tool was in case you forgot something simple you wouldn't need to open a browser, search for it in Google, and then try and find the best answer. Now you can just use the CLI to get the answer quickly.

## Installation
First, you have to clone the repository since the package hasn't been added to NPM yet:
```
git clone https://github.com/btzc/halp-cli.git
```

Next, `cd` into the folder where you cloned it and run
```
npm install -g .
```
I promise it's not malicious (probably)...

After that you're all set! Just invoke it from the terminal using
```
halp <your query>
```


## Usage
As mentioned above, this tool was more a convenience thing for searching relatively easy stuff such as syntax or native language functions.

```
halp <your query>
```

![reverse list example](https://github.com/btzc/halp-cli/blob/master/imgs/javascript_example.PNG)

If that doesn't give you what you're looking for, you can try adding tags yourself. The tool tries to parse the query string and automatically decide on tags to search StackOverflow with. Examples of tags are keywords like languages, tools, data structures, etc.

```
halp <your query> -t <your tags>
```

Finally, if you're looking for something other than stackoverflow. Maybe you want to read a medium tutorial. You can now specify a specific source. Currently it's only limited to `stackoverflow` or `medium`. The default is `stackoverflow`.
```
halp <your query> -s <your source>
```
