#' rhtmlEchoLifecycle HTML Widget
#'
#' @description A HTMLWidget that echos function calls for debugging purposes.
#'
#' @examples
#'
#' rhtmlEchoLifecycle::draw(600, 600, '')
#'
#' @author Kyle Zeeuwen <kyle.zeeuwen@gmail.com>
#'
#' @source https://github.com/Displayr/rhtmlEchoLifecycle
#'
#' @import htmlwidgets
#'
#' @export
#'

draw <- function(width = 600, height = 600, settings = '') {

  htmlwidgets::createWidget(
    name = 'rhtmlEchoLifecycle',
    settings,
    width = width,
    height = height,
    sizingPolicy = htmlwidgets::sizingPolicy(
      defaultWidth = width,
      defaultHeight = height,
      browser.fill = TRUE,
      viewer.fill = TRUE,
      padding = 0
    ),
    # TEMPLATE! - update the name here
    package = 'rhtmlEchoLifecycle'
  )
}
