using Expenses.API.Data;
using Expenses.API.Data.Services;
using Expenses.API.DTO;
using Expenses.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Expenses.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController(ITransactionsService transactionsService) : ControllerBase
    {
        [HttpGet("All")]
        public IActionResult GetAllTransaction()
        {
            var transactions = transactionsService.GetAll();
            if (transactions == null || !transactions.Any())
            {
                return NotFound("No transactions found");
            }
            return Ok(transactions);
        }

        [HttpGet("Details/{id}")]
        public IActionResult GetTransactionById(int id)
        {
            var transaction = transactionsService.GetById(id);
            if (transaction == null)
            {
                return NotFound();
            }
            return Ok(transaction);
        }

        [HttpPost("Create")]
        public IActionResult CreateTransaction([FromBody] PostTransactionDto postTransactionDto)
        {
            if (postTransactionDto == null)
            {
                return BadRequest("Transaction data is null");
            }
            if (string.IsNullOrEmpty(postTransactionDto.Type) || postTransactionDto.Amount <= 0 || string.IsNullOrEmpty(postTransactionDto.Category))
            {
                return BadRequest("Invalid transaction data");
            }
            transactionsService.Add(postTransactionDto);
            return Ok();
        }

        [HttpPost("Update/{id}")]
        public IActionResult UpdateTransaction(int id, [FromBody] PostTransactionDto postTransactionDto)
        {
            if (postTransactionDto == null)
            {
                return BadRequest("Transaction data is null");
            }
            transactionsService.Update(id, postTransactionDto);
            return Ok();
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult DeleteTransaction(int id)
        {
            var transaction = transactionsService.GetById(id);
            if (transaction == null)
            {
                return NotFound("Transaction not found");
            }
            transactionsService.Delete(id);
            return Ok();
        }
    }
}
