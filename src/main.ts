import { Plugin } from 'obsidian'
import { ViewPlugin } from '@codemirror/view'
import type { EditorView, PluginValue, ViewUpdate } from '@codemirror/view'
import type { UnoGenerator, UserConfig } from '@unocss/core'
import { createGenerator } from '@unocss/core'

import { evaluateAnyModule } from './import'
import { defaultConfigRaw } from './constants'

function debounce<T extends (...args: any) => any>(fn: T, wait: number) {
  let timer: any = null

  return function (...args: Parameters<T>) {
    if (timer)
      return

    timer = setTimeout(() => {
      timer = null
      fn(...Array.from(args))
    }, wait)
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class UnoCSSCodeMirrorViewPlugin implements PluginValue {
  private view: EditorView
  private styleElement: HTMLStyleElement | undefined
  private unocssCodeGenerator: UnoGenerator<object>

  constructor(view: EditorView, unocssCodeGenerator: UnoGenerator<object>) {
    this.view = view
    this.unocssCodeGenerator = unocssCodeGenerator

    this.init()
  }

  update(update: ViewUpdate) {
    if (!update.docChanged || !update.viewportChanged)
      return

    const generate = debounce(this.generateOnUpdates.bind(this), 500)
    generate(update)
  }

  destroy(): void {
    try {
      if (this.styleElement?.parentElement)
        this.styleElement?.parentElement.removeChild(this.styleElement)

      this.styleElement?.remove()
    }
    catch (e) {
      console.error(e)
    }
  }

  async init() {
    await this.waitForViewDOM()
    await this.generate()
  }

  async waitForViewDOM(seconds: number = 5) {
    let i = 0

    while (!this.view || !this.view.dom) {
      await sleep(1000)

      i++
      if (i > seconds)
        return
    }
  }

  async generate() {
    await this.waitForViewDOM()
    await this.generateCSSFromHTMLContent(this.unocssCodeGenerator, this.view.dom, this.view.state.doc.toString())
  }

  async generateOnUpdates(update: ViewUpdate) {
    await this.waitForViewDOM()
    await this.generateCSSFromHTMLContent(this.unocssCodeGenerator, this.view.dom, update.state.doc.toString())
  }

  async generateCSSFromHTMLContent(unocssCodeGenerator: UnoGenerator<object>, dom: HTMLElement, htmlContent: string) {
    const generatedOutput = await unocssCodeGenerator.generate(htmlContent)

    const existingStyleElement = dom.querySelector('#obsidian-plugin-unocss-styles')
    if (existingStyleElement)
      this.styleElement = existingStyleElement as HTMLStyleElement

    this.styleElement ||= dom.createEl('style')
    this.styleElement.id = 'obsidian-plugin-unocss-styles'
    this.styleElement.innerHTML = generatedOutput.css
  }
}

export default class UnoCSSPlugin extends Plugin {
  async onload() {
    // https://github.com/unocss/unocss/blob/main/playground/src/composables/config.ts
    const unocssConfig = await evaluateAnyModule<UserConfig>(defaultConfigRaw)
    if (!unocssConfig)
      return

    // https://github.com/unocss/unocss/blob/6d94efc56b0c966f25f46d8988b3fd30ebc189aa/playground/src/composables/uno.ts#L13
    const uno = await createGenerator({}, unocssConfig)
    const editorPlugins = ViewPlugin.define(view => new UnoCSSCodeMirrorViewPlugin(view, uno))

    this.registerEditorExtension(editorPlugins)
  }
}
