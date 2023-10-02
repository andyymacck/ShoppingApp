using System;
using System.Collections.Generic;

namespace web.Models;

public partial class Clothes
{
    public int ProductId { get; set; }

    public int? CategoryId { get; set; }

    public string ProductName { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public string? Size { get; set; }

    public string? Color { get; set; }

    public string? ImageUrl { get; set; }

    public string? Sex { get; set; }

    public virtual Category? Category { get; set; }

    public List<Cart> Carts { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; }
}
