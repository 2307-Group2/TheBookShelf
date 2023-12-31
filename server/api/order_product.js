const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authorization = require("../middleware");

// get an unfulfilled order
router.get("/", authorization, async (req, res, next) => {
  console.log("order user", req.user);
  
  try {
    const openOrder = await prisma.order.findFirst({
      where: {
        userId: req.user.id,
        isFulfilled: false,
      },
      include: {
        order_products: true,
      },
    });
    console.log("OpenOrder", openOrder)
    res.status(200).send({ cart: openOrder.order_products });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// adding item to cart
router.post("/", authorization, async (req, res, next) => {
  const { booksId, quantity, price, title } = req.body;
  try {
    const openOrder = await prisma.order.findFirst({
      where: {
        userId: req.user.id,
        isFulfilled: false,
      },
      include: {
        order_products: true,
      },
    });

    const existingBook = openOrder.order_products.find(
      (book) => book.booksId === booksId
    );

    if (existingBook) {
      const updatedOrderProduct = await prisma.order_product.update({
        where: { id: existingBook.id },
        data: {
          quantity: existingBook.quantity + quantity,
        },
      });

      const openOrder = await prisma.order.findFirst({
        where: {
          userId: req.user.id,
          isFulfilled: false,
        },
        include: {
          order_products: true,
        },
      });

      
      res.send({addedToCart: openOrder.order_products})
    } else {
      const createdOrderProduct = await prisma.order_product.create({
        data: {
          orderId: openOrder.id,
          booksId,
          quantity,
          price,
          title,
        },
      }); 
      const updatedOrder = await prisma.order.findFirst({
        where: {
          userId: req.user.id,
          isFulfilled: false,
        },
        include: {
          order_products: true,
        },
      });
      res.send({addedToCart: updatedOrder.order_products})
    }
  } catch (err) {
    next(err);
  }
});
router.delete("/:id", authorization, async (req, res, next) => {
  const { booksId, quantity, price } = req.body;
  try {
  
    const deleteOrderProduct = await prisma.order_product.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    const deletedFromOrder = await prisma.order.findFirst({
      where: {
        userId: req.user.userId,
        isFulfilled: false,
      },
      include: {
        order_products: true,
      },
    });

    res.send({deleteOrderProduct: deletedFromOrder.order_products});
  } catch (err) {
    next(err);
  }
});
router.put("/:id", authorization, async (req, res, next) => {
  const { qty:quantity } = req.body;
  console.log(req.params.id,quantity)
  console.log('body',req.body)
  try {
    const openOrder = await prisma.order.findFirst({
      where: {
        userId: req.user.userId,
        isFulfilled: false,
      },
      include: {
        order_products: true,
      },
    });

    const updateOrderProduct = await prisma.order_product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        quantity,
      }
    });

    res.send(updateOrderProduct);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
