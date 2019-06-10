const gulp = require('gulp')
const rhtmlBuildUtils = require('rhtmlBuildUtils')

gulp.task('testSpecs', gulp.series(function (done) {
  console.log('skipping testSpecs')
  done()
}))

gulp.task('testVisual', gulp.series(function (done) {
  console.log('skipping testVisual')
  done()
}))

gulp.task('testVisual_s', gulp.series(function (done) {
  console.log('skipping testVisual_s')
  done()
}))

const dontRegisterTheseTasks = ['testVisual', 'testVisual_s', 'testSpecs']
rhtmlBuildUtils.registerGulpTasks({ gulp, exclusions: dontRegisterTheseTasks })
