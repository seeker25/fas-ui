// /**
//  * the vue-cli fas ui creates those file in lib, but vite build them on dist, this file is moving them to lib
//  */
// const fs = require('fs')
// const path = require('path')

// const filesToMove = [
//   'lib.umd.min.js',
//   'lib.umd.min.js.map'
// ]

// filesToMove.forEach(file => {
//   const sourcePath = path.join(__dirname, 'dist', file)
//   const destinationPath = path.join(__dirname, 'lib', file)

//   fs.rename(sourcePath, destinationPath, (err) => {
//     if (err) {
//       console.error(`Error moving ${file}:`, err)
//     } else {
//       console.log(`Moved ${file} to lib folder.`)
//     }
//   })
// })
