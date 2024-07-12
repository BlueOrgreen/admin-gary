import svgSpriteLoader from 'svg-sprite-loader'

function loader(source) {
  // svg-sprite-loader workaround for rspack, with no extract support.
  this._module = this._module || {}
  this.target = this.target || 'web'
  return svgSpriteLoader.call(this, source)
}

export default loader
