using Microsoft.AspNetCore.Identity;

public class Order
{
    public int OrderId { get; set; }
    public string UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalPrice { get; set; }
    public string MaskedCcInfo { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; }
}