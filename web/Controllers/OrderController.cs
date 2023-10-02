using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web.Models;

namespace web.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly ClothesContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public OrderController(ClothesContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreationDto orderDto)
        {
            if (orderDto == null)
            {
                return BadRequest();
            }

            var userId = _userManager.GetUserId(User);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return Unauthorized();
            }

            // Retrieve the cart items for the user
            var cartItems = await _context.Carts
                                          .Where(c => c.UserId == userId)
                                          .Include(c => c.Product)
                                          .ToListAsync();

            if (cartItems == null || !cartItems.Any())
            {
                return BadRequest("No items in the cart to create an order.");
            }

            // Calculate the total price based on the cart items
            var totalPrice = cartItems.Sum(c => c.Quantity * c.Product.Price);

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                TotalPrice = totalPrice,
                MaskedCcInfo = MaskCreditCard(orderDto.CardNumber),
                OrderItems = new List<OrderItem>()
            };

            // Adding OrderItems based on CartItems
            foreach (var cartItem in cartItems)
            {
                var orderItem = new OrderItem
                {
                    ProductId = cartItem.ProductId.GetValueOrDefault(),
                    Quantity = cartItem.Quantity,
                    Price = cartItem.Product.Price
                };
                order.OrderItems.Add(orderItem);
            }

            _context.Orders.Add(order);

            _context.Carts.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            var response = new OrderResponseDto
            {
                OrderId = order.OrderId,
                TotalCost = order.TotalPrice
            };
            return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderResponseDto>> GetOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return new OrderResponseDto 
            {
                OrderId = order.OrderId,
                TotalCost = order.TotalPrice
            };
        }

        private string MaskCreditCard(string cardNumber)
        {
            if (string.IsNullOrEmpty(cardNumber) || cardNumber.Length < 4)
            {
                return string.Empty;
            }

            return new string('*', cardNumber.Length - 4) + cardNumber.Substring(cardNumber.Length - 4);
        }
    }

    public class OrderResponseDto
    {
        public int OrderId { get; set; }
        public decimal TotalCost { get; set; }
    }

    public class OrderCreationDto
    {
        public string CardNumber { get; set; }
    }
}
