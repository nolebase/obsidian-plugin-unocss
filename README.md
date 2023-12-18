# Obsidian Plugin UnoCSS

> [!NOTE]
> This is one of the plugins of the collections of plugins called [Nólëbase Integrations](https://github.com/nolebase/integrations). You can explore the other plugins in the collection in [the official documentation site of Nólëbase Integrations](https://nolebase-integrations.ayaka.io).

---

**Write your notes in [Obsidian](https://obsidian.md/) with [UnoCSS](https://unocss.dev/).**

## 🤔 Why

> If you're not yet familiar with [Nólëbase](https://github.com/nolebase/nolebase) or the accompanying [Nólëbase Integrations](https://github.com/nolebase/integrations), let me introduce you. Nólëbase is an open-source knowledge base that utilizes VitePress for rendering, and it is a collaborative effort from its community of contributors.
>
> To integrate Obsidian plugins with VitePress-rendered pages effectively, we launched the Nólëbase Integrations project. This initiative aims to create a suite of plugins that enhance the functionality of popular Obsidian plugins, enabling them to be able to work in the browsers as rendered pages.

When crafting documentation in [Nólëbase](https://github.com/nolebase/nolebase), creating numerous visual components is crucial for enhancing the documents with dynamic and interactive user interfaces. This not only makes the content more digestible but also more engaging.
Previously, [Obsidian](https://obsidian.md) lacked the functionality to effectively integrate and apply styles from atomic CSS frameworks like [Tailwind CSS](https://tailwindcss.com/docs/display) and [Windi CSS](https://windicss.org/) to HTML elements within its platform.

This is where Obsidian UnoCSS Plugin kicks in, it allows you to write your notes in [Obsidian](https://obsidian.md/) with [UnoCSS](https://unocss.dev/).
By doing so, it has built a bridge by allowing the use of sufficiently simple and user-friendly atomic CSS classes, which enhances the aesthetics and functionality of the notes and documents we write in Obsidian.

## 🎨 Features

- 🪄 Whatever [UnoCSS](https://github.com/unocss/unocss) supports.
- 📦 [Out of the box supports](https://unocss.dev/presets/wind) for atomic CSS classes that used by famously known [Tailwind CSS](https://tailwindcss.com/docs/display) and [Windi CSS](https://windicss.org/).
- 🚀 Blazingly fast hot-reloading capabilities during editing.
- 🎁 Stunning icons from [Iconify](https://icones.js.org/).

## 💡 What can you do with it

- Embed interactive components in your notes.
- Style your notes with atomic CSS classes.
- Use themes and color schemes from UnoCSS communities.
- Import the icons from [Iconify](https://icones.js.org/).
- Animate your notes.
- Documenting color theories.
- Documenting UI/UX knowledge.
- Demonstrating the back scene of Mathemathics and Physics like [manim](https://github.com/ManimCommunity/manim/)
- And more...

## 📺 Demos

> Show me what you can do

### How it looks like

https://github.com/nolebase/obsidian-plugin-unocss/assets/11081491/96a7752a-2e24-4e49-828b-8f8847838158

### What is the markup like

It's all basic just a set of HTML.

> [!WARNING]
> To learn more about what are the meanings of classes, I recommend you to use the documentation sites of [Tailwind CSS](https://tailwindcss.com/docs/display) and [Windi CSS](https://windicss.org/) as references.

https://github.com/nolebase/obsidian-plugin-unocss/assets/11081491/1ff2aa44-dc7c-48b5-9dd7-0271a3661e92

### Hot-reloading capabilities in live preview mode

> [!NOTE]
> To do so, you need to split your Obsidian view into two panes, and choose "Source mode" for the editing pane where you wanted to view and edit the HTML markup.

https://github.com/nolebase/obsidian-plugin-unocss/assets/11081491/197edb93-4b21-4960-8c90-7cf79b037356

## 😎 How to install

> [!WARNING]
> Currently Obsidian UnoCSS Plugin is in alpha stage, it wasn't guaranteed to work properly and keep the compatibility with the future versions of itself.
>
> But it is encouraged to try it out and give feedbacks. If you find and bugs or have any suggestions, please feel free to open an issue on [GitHub](https://github.com/nolebase/obsidian-plugin-unocss/issues).

Currently, it is a bit hard to install the plugin for now before it is published to the official Obsidian plugin store. Manual downloading and installation is required.

### Install with beta testing helper [BRAT](https://tfthacker.com/brat-quick-guide) plugin

1. Install the [BRAT](https://tfthacker.com/brat-quick-guide) plugin right from the official Obsidian plugin store.
2. Enable the BRAT plugin in the community plugins settings menu.
3. Open Command palette to choose `BRAT: Plugins: Add a beta plugin for testing`.
4. Copy and paste the following link to the first field of the new prompted dialog:

```txt
https://github.com/nolebase/obsidian-plugin-unocss
```

5. Find the needed released version on [Release page of Obsidian UnoCSS Plugin](https://github.com/nolebase/obsidian-plugin-unocss/releases), for example, fill in `0.1.0`.
6. Enable the "UnoCSS" plugin from the `Installed plugins` list.

### Install manually

1. Navigate to the [Release page of Obsidian UnoCSS Plugin](https://github.com/nolebase/obsidian-plugin-unocss/releases)
2. Find the [latest version of the plugin](https://github.com/nolebase/obsidian-plugin-unocss/releases/latest).
3. Download the `main.js` file and `manifest.json` file.
4. Open up the `.obsidian/plugins` directory of your Obsidian vault.
5. If no `.obsidian/plugins` directory exists, create one.
6. Create a new directory named `obsidian-plugin-unocss` inside the `.obsidian/plugins` directory.
7. Move `main.js` file and `manifest.json` file into the `obsidian-plugin-unocss` directory.

The directory structure should look like this after these steps:

```shell
❯ tree
.
├── main.js
├── manifest.json
```

8. Enable the "UnoCSS" plugin from the "Installed plugins" list.

## ⏳ TODOs

- [ ] Auto completion for CSS classes.
- [ ] Annotation decoration for UnoCSS identifiable classes.

## 💻 How to develop

1. As [Build a plugin - Developer Documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin) has suggested, create a separate vault for development.
2. (Optional) Install the hot-reload plugin: [pjeby/hot-reload](https://github.com/pjeby/hot-reload).
3. Create a `.obsidian/plugins` directory in the vault root.
4. Clone this repository into the `.obsidian/plugins` directory.
5. Install dependencies

```shell
pnpm install
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
ni
```

6. Build the plugin

```shell
pnpm run build
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
nr build
```

7. Reload Obsidian to see the changes. (If you use the hot-reload plugin, you don't need to reload Obsidian manually.)

> Reloading can be called from the command palette with `Reload app without saving` command.

## 🔨 How to build

```shell
pnpm run build
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
nr build
```

### Written with ♥
