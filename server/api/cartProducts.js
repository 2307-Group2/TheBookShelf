const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const allProducts = await prisma.order_product.findMany();
    res.send(allProducts);
  } catch (err) {
    next(err);
  }
});

router.get("/orders/:id", async (req, res, next) => {
  try {
    const orders = await prisma.users.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        is_Cart: true,
      },
    });
  } catch (err) {
    next(err);
  }
});


module.exports = router;


// router.get("/:id/categories", async(req,res,next)=>{
//   try{
//       const post = await prisma.post.findUnique({
//           where:{
//               id: Number(req.params.id)
//           },
//           include:{
//               categories: true
//           }
//       });
//       res.send(post.categories)
//   }catch(err){
//       next(err)
//   }
// })
// // grabs all records that have an association with the shown category
// router.get("category/:id", async(req,res,next)=>{
//   try{
//       const collection = await prisma.categoriesOnPosts.findMany({
//           where:{
//               category:{
//                   id: req.params.id
//               }
//           },
//       });
//       res.send(collection)
//   }catch(err){
//       next(err)
//   }
// })
