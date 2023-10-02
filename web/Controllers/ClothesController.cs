using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using web;
using web.Models;

[Route("api/[controller]")]
public class ClothesController : ControllerBase
{
    private readonly ClothesContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public ClothesController(UserManager<IdentityUser> userManager, ClothesContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    // GET: api/Clothes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Clothes>>> GetClothes()
    {
        return await _context.Clothes.ToListAsync();
    }

    // GET: api/Clothes/categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        return await _context.Categories.ToListAsync();
    }

    // GET: api/Clothes/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Clothes>> GetClothes(int id)
    {
        var Clothes = await _context.Clothes.FindAsync(id);
        if (Clothes == null)
            return NotFound();

        return Clothes;
    }

    // POST: api/Clothes
    [Authorize(Roles = "WebAdmin")]
    [HttpPost]
    public async Task<ActionResult<Clothes>> PostClothes([FromBody] Clothes Clothes)
    {
        _context.Clothes.Add(Clothes);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetClothes", new { id = Clothes.ProductId }, Clothes);
    }

    // PUT: api/Clothes/5
    [Authorize(Roles = "WebAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutClothes(int id, [FromBody] Clothes Clothes)
    {
        if (id != Clothes.ProductId)
            return BadRequest();

        _context.Entry(Clothes).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Clothes.Any(e => e.ProductId == id))
                return NotFound();

            throw;
        }

        return NoContent();
    }

    // DELETE: api/Clothes/5
    [Authorize(Roles = "WebAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClothes(int id)
    {
        var Clothes = await _context.Clothes.FindAsync(id);
        if (Clothes == null)
            return NotFound();

        _context.Clothes.Remove(Clothes);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}