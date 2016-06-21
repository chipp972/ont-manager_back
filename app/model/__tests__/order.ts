let testd = `
// order
{
  "reference": "DABHKA7648p71",
  "placeIdSource":2,
  "placeIdDestination": 0,
  "userId": 0,
  "stock": [
    { "categoryId": 2, "quantity": 25, "unitPrice": 89 },
    { "categoryId": 3, "quantity": 2, "unitPrice": 8 },
    { "categoryId": 4, "quantity": 5, "unitPrice": 9 },
    { "categoryId": 2, "quantity": 8, "unitPrice": 859 }
  ]
}

// category
{
  "name": "cable5m"
}

{
  "name": "cable10m"
}

{
  "name": "cable",
  "subCategoryId": [0, 1]
}

// user
{
  "email": "nicolas.tset@gmail.com",
  "password": "secret123"
}
`
