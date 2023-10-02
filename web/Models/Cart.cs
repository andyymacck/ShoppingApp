using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace web.Models;

public partial class Cart
{
    public int CartId { get; set; }

    public string? UserId { get; set; }

    public int? ProductId { get; set; }

    public int Quantity { get; set; }

    public virtual Clothes? Product { get; set; }
}
