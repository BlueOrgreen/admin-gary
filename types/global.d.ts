// 定义各种全局 TypesSript 模块 / 命名空间 / 类型 / 接口 等

/// <reference types="@rsbuild/core/types" />

declare module '*.less'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.svg?react'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module 'watermark-plus'

declare type BROWSER_SUPPORT_DETECTER = {
  AVIF: boolean
  WEBP: boolean
}

declare interface Window {
  BROWSER_SUPPORT_DETECTER: BROWSER_SUPPORT_DETECTER
  REACT_APP_API_ENV: string
}

declare type TablePaginationType = {
  current: number
  size: number
}

declare type OptionsItem = {
  label: string
  value: string | number
  children?: OptionsItem[]
  [key?: string]: any
}

declare type Options = {
  label: string
  value: string | number
  children?: Options
  [key?: string]: any
}[]
