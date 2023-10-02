using System;
using System.Collections.Generic;

namespace web.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? CategoryDescription { get; set; }

    public virtual ICollection<Clothes> Clothes { get; set; } = new List<Clothes>();
}
