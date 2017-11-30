const gulp = require('gulp')
const rhtmlBuildUtils = require('rhtmlBuildUtils')

const dontRegisterTheseTasks = ['testVisual', 'testVisual_s', 'testSpecs']
rhtmlBuildUtils.registerGulpTasks({ gulp, exclusions: dontRegisterTheseTasks })

gulp.task('testSpecs', () => console.log('skipping testSpecs'))
gulp.task('testVisual', () => console.log('skipping testVisual'))
gulp.task('testVisual_s', () => console.log('skipping testVisual_s'))
