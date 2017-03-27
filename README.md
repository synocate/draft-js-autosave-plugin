# DraftJS Autosave Plugin

[![npm version](https://badge.fury.io/js/draft-js-autosave-plugin.svg)](http://badge.fury.io/js/draft-js-autosave-plugin) [![volkswagen status](https://auchenberg.github.io/volkswagen/volkswargen_ci.svg?v=1)](https://github.com/auchenberg/volkswagen)

*This is a plugin for the `draft-js-plugins-editor`.*

This plugin allows you to add autosave functionality via a callback function to your plugins-enabled editor.

## Usage

First instantiate the plugin, passing the necessary props in the [`config`](https://github.com/synocate/draft-js-autosave-plugin#config):

```js
import createAutosavePlugin from 'draft-js-autosave-plugin';

const autosavePlugin = createAutosavePlugin(config);
```

And then pass the plugin into a `draft-js-plugins-editor` component:

```js
import Editor from 'draft-js-plugins-editor'

<Editor plugins={[autosavePlugin]} />
```

## Config

The plugin requires a config with a saveFunction property, and a few optional properties:

```js

const mySaveFunction = () => { /* A function that does something */ }

const config = {
  saveFunction: mySaveFunction,
  debounceTime: 3000,
  saveAlways: true
}
const autosavePlugin = createAutosavePlugin(config)
```

The config options and their defaults are:

| Option | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
| `saveFunction` | `Function` | Required callback function that will be called upon a save event | `none` | `*`
| `debounceTime` | `integer` | Time, in milliseconds, to [`debounce`](https://css-tricks.com/the-difference-between-throttling-and-debouncing/) the firing of save events between changes | 2000 | 
| `saveAlways` | `Boolean` | Whether or not to call saveFunction callback for both selection and content changes, rather than just content (DraftJS fires onChange events for both) | `false` |
| `savingComponent` | `React Component` | A custom react component to display the saving status; will receive props from plugin | [SavingComponent](https://github.com/synocate/draft-js-autosave-plugin/blob/master/src/SavingComponent/index.js) |

## Component

You can get the saving status component (or your own supplied custom component, decorated with props) from the instance:

```js
const {
  SavingComponent
} = autosavePlugin;
```

Render this in your component wherever you'd like:

```HTML
<div className="toolbar">
  <SavingComponent />
</div>
```

The component has a couple optional props:

| Prop | Type | Description | Default |
| --- | --- | --- | --- |
| `saving` | `Boolean` | If you're using an asynchronous saving function, the component needs to be made aware of the in-flight status to render saving status appropriately (otherwise it will be considered `saved` upon calling the saveFunction callback) | `none`
| `theme` | `object` | Object of css classNames that will be applied to the saving component. Default theming classes are replaced entirely (see [here](https://github.com/synocate/draft-js-autosave-plugin/blob/master/src/index.js#L48) for more details) if property provided. | [styles.css](https://github.com/synocate/draft-js-autosave-plugin/blob/master/src/SavingComponent/styles.css) | 



## Importing the default styles

The plugin ships with a default styling available at this location in the installed package:
`node_modules/draft-js-autosave-plugin/lib/plugin.css`.

### Webpack Usage
Follow the steps below to import the css file by using Webpack's `style-loader` and `css-loader`.

1. Install Webpack loaders: `npm install style-loader css-loader --save-dev`
2. Add the below section to Webpack config (if your Webpack already has loaders array, simply add the below loader object(`{test:foo, loaders:bar[]}`) as an item in the array).

    ```js
    module: {
      loaders: [{
        test: /\.css$/,
        loaders: [
          'style', 'css'
        ]
      }]
    }
    ```

3. Add the below import line to your component to tell Webpack to inject style to your component.

    ```js
    import 'draft-js-mention-plugin/lib/plugin.css';
    ```
4. Restart Webpack.


### Browserify Usage

TODO: PR welcome


## Specifying Your Own SavingComponent

If you'd like, you can specify your own custom SavingComponent to handle the saving status. Your component will be decorated with a few props and become available on the plugin instance.

Props that will be passed to your component:

  - **getIsClean** (_func_) - returns a boolean indicating whether or not the plugin has any pending changes to be saved
  - **theme** (_object_) -  object of css classNames, [see default here](https://github.com/synocate/draft-js-autosave-plugin/blob/master/src/SavingComponent/styles.css)

Example:

```js

const MySavingComponent = ({ saving, getIsClean, theme }) => {
  const saved = getIsClean() && !saving;
  return (
    <div className={saved ? theme.container : `${theme.container} ${theme.containerSaving}`}>
      <span
        className={saved ? theme.textSaved : theme.textSaving}
      >
        {!saved && 'Saving...'}
        {saved && 'All Changes Saved.'}
      </span>
      <span style={{ marginLeft: '0.2em' }}>{'🖫'}</span>
    </div>
  );
};
```

The above presentational component must then be passed into the config:

```js
const autosavePlugin = createAutosavePlugin({ ...config, savingComponent: MySavingComponent });
```

## draft-js-plugins-editor version info

This plugin is built for `draft-js-plugins-editor` version `2.0.0-beta10` and should be considered to be in beta until draft-js-plugins-editor and this plugin reach a full `2.0.0` release

## License

MIT

## TODO

- [ ] Remove extraneous packages from package.json
- [ ] Add testing
