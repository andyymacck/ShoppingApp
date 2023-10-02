using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using web.Models;

namespace web.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ClothesContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public CartController(ClothesContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCartItems()
        {
            var userId = _userManager.GetUserId(User);
            var cartItems = await _context.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .Select(c => new CartItemDto
                {
                    CartId = c.CartId,
                    Quantity = c.Quantity,
                    Product = new ProductDto
                    {
                        ProductId = c.Product.ProductId,
                        ProductName = c.Product.ProductName,
                        PricePerUnit = c.Product.Price,
                        imageUrl = c.Product.ImageUrl
                    }
                })
                .ToListAsync();
            return Ok(cartItems);
        }

        [HttpPost("{productId}")]
        public async Task<ActionResult> AddToCart(int productId, [FromBody] QuantityModel model)
        {
            var userId = _userManager.GetUserId(User);
            var product = await _context.Clothes.FindAsync(productId);

            if (product == null)
                return NotFound("Product not found");

            var existingCartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += model.Quantity;
            }
            else
            {
                var newCartItem = new Cart
                {
                    UserId = userId,
                    ProductId = productId,
                    Quantity = model.Quantity
                };
                _context.Carts.Add(newCartItem);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{cartId}")]
        public async Task<ActionResult> UpdateCartItem(int cartId, [FromBody] UpdateCartItemDto updateCartItemDto)
        {
            var userId = _userManager.GetUserId(User);

            var cartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.CartId == cartId && c.UserId == userId);

            if (cartItem == null)
                return NotFound("Cart item not found");

            var product = await _context.Clothes.FindAsync(cartItem.ProductId);

            if (product == null)
                return NotFound("Product not found");

            cartItem.Quantity = updateCartItemDto.Quantity;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{cartItemId}")]
        public async Task<ActionResult> RemoveFromCart(int cartItemId)
        {
            var userId = _userManager.GetUserId(User);
            var cartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.CartId == cartItemId && c.UserId == userId);

            if (cartItem == null)
                return NotFound("Cart item not found");

            _context.Carts.Remove(cartItem);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }

    public class UpdateCartItemDto
    {
        public int Quantity { get; set; }
    }

    public class QuantityModel
    {
        public int Quantity { get; set; }
    }
    public class CartItemDto
    {
        public int CartId { get; set; }
        public int Quantity { get; set; }
        public ProductDto Product { get; set; }
        public decimal TotalPrice => Quantity * Product.PricePerUnit;
    }

    public class ProductDto
    {
        public string imageUrl { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal PricePerUnit { get; set; }
    }
}