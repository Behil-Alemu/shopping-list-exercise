const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")

router.get("/", function (req, res) {
  res.json({ items })
})

router.post("/", function (req, res, next) {
  try {
    if (!req.body.name &&!req.body.price ) throw new ExpressError("Item name and price is required", 400);
    const newItem = { name: req.body.name, price:req.body.price, }
    items.push(newItem)
    return res.status(201).json({ list: newItem })
  } catch (e) {
    return next(e)
  }
})

router.get("/:name", function (req, res) {
  const fromList = items.find(item => item.name === req.params.name)
  if (fromList === undefined) {
    throw new ExpressError("Item not found", 404)
  }
  res.json({ list: fromList })
})

router.patch("/:name", function (req, res) {
  const fromList = items.find(item => item.name === req.params.name)
  if (fromList === undefined) {
    throw new ExpressError("item not found", 404)
  }
  fromList.name = req.body.name
  res.json({ list: fromList })
})
router.delete("/:name", function (req, res) {
  const fromList = items.findIndex(item => item.name === req.params.name)
  if (fromList === -1) {
    throw new ExpressError("Item not found", 404)
  }
  items.splice(fromList, 1)
  res.json({ message: "Deleted item" })
})

module.exports = router;