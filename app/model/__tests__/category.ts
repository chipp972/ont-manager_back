// SubCategory.remove({ categoryId: 0 }, (err) => console.log(err))

// add a category then a sub_category it should get added
// add a sub_category with wrong categoryId and it should fail

// let subcat = new SubCategory({ description: 'FTTH equipment', name: 'fcaaal', categoryId: 3 })
// subcat.save((err) => {
//   if (err) {console.log(err)
//   }else {
//     SubCategory.find({})
//     .populate('categoryId')
//     .exec((err, sc) => console.log(sc))
//   }
// })
