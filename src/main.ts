import { Plugin } from 'obsidian'
import { ViewPlugin } from '@codemirror/view'
import type { EditorView, PluginValue, ViewUpdate } from '@codemirror/view'
import { createGenerator } from 'unocss'
import type { UnoGenerator, UserConfig } from 'unocss'

import { evaluateUserConfig } from './unocssConfig'
import { defaultConfigRaw } from './constants'

let timer: any = null

function debounce(fn: Function, wait: number) {
  if (timer)
    return

  timer = setTimeout(() => {
    timer = null
    fn()
  }, wait)
}

class UnoCSSCodeMirrorViewPlugin implements PluginValue {
  private viewDom: HTMLElement
  private unocssConfig: UserConfig<object> | undefined
  private unocssConfigReady: boolean = false
  private unocssCodeGenerator: UnoGenerator<object> | undefined
  private styleElement: HTMLStyleElement | undefined

  constructor(view: EditorView) {
    this.viewDom = view.dom

    this.unocssConfig = undefined
    this.unocssCodeGenerator = undefined

    this.init()
  }

  update(update: ViewUpdate) {
    if (!update.docChanged || !update.viewportChanged)
      return

    debounce(this.generate.bind(this), 500)
  }

  async init() {
    await this.loadUnoCSSConfig()
    await this.generate()
  }

  async loadUnoCSSConfig() {
    const config = await evaluateUserConfig(defaultConfigRaw)
    if (!config)
      return

    this.unocssConfig = config
    this.unocssCodeGenerator = createGenerator({}, this.unocssConfig)
    this.unocssConfigReady = true
  }

  async waitForViewDOM(seconds: number = 5) {
    let i = 0

    while (!this.viewDom) {
      await new Promise(resolve => setTimeout(resolve, 1000))

      i++
      if (i > seconds)
        return
    }
  }

  async waitForUnoCSSConfig(seconds: number = 5) {
    let i = 0

    while (!this.unocssConfigReady) {
      await new Promise(resolve => setTimeout(resolve, 1000))

      i++
      if (i > seconds)
        return
    }
  }

  async waitForUnoCSSGenerator(seconds: number = 5) {
    let i = 0

    while (!this.unocssCodeGenerator) {
      await new Promise(resolve => setTimeout(resolve, 1000))

      i++
      if (i > seconds)
        return
    }
  }

  async waitAllBeforeGenerate() {
    await this.waitForUnoCSSConfig()
    await this.waitForUnoCSSGenerator()
    await this.waitForViewDOM()
  }

  async generate() {
    this.waitAllBeforeGenerate()
    if (!this.viewDom || !this.unocssConfig || !this.unocssCodeGenerator)
      return

    this.generateCSSFromHTMLContent(this.unocssCodeGenerator, this.viewDom, this.viewDom.innerHTML)
  }

  async generateCSSFromHTMLContent(unocssCodeGenerator: UnoGenerator<object>, dom: HTMLElement, htmlContent: string) {
    const generatedOutput = await unocssCodeGenerator.generate(htmlContent)

    this.styleElement ||= dom.createEl('style')
    this.styleElement.innerHTML = generatedOutput.css
  }
}

export default class UnoCSSPlugin extends Plugin {
  async onload() {
    const editorPlugins = ViewPlugin.fromClass(UnoCSSCodeMirrorViewPlugin)
    this.registerEditorExtension(editorPlugins)
  }
}
