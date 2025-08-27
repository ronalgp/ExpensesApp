using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Expenses.API.DTO;
using Expenses.API.Models;

namespace Expenses.API.Data.Services
{
    public interface ITransactionsService
    {
        List<Transaction> GetAll(int userId);
        Transaction? GetById(int id);
        void Add(PostTransactionDto postTransactionDto, int userId);
        void Update(int id, PostTransactionDto postTransactionDto);
        void Delete(int id);
    }
    public class TransactionsService(AppDbContext context) : ITransactionsService
    {
        public List<Transaction> GetAll(int userId)
        {
            return context.Transactions.Where(x => x.UserId == userId).ToList();
        }
        public Transaction? GetById(int id)
        {
            return context.Transactions.Find(id);
        }
        public void Add(PostTransactionDto postTransactionDto, int userId)
        {
            var transaction = new Transaction
            {
                Type = postTransactionDto.Type,
                Amount = postTransactionDto.Amount,
                Category = postTransactionDto.Category,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = userId
            };
            context.Transactions.Add(transaction);
            context.SaveChanges();
        }
        public void Update(int id, PostTransactionDto postTransactionDto)
        {
            var transaction = context.Transactions.Find(id);
            if (transaction == null)
            {
                throw new KeyNotFoundException("Transaction not found");
            }
            transaction.Type = postTransactionDto.Type;
            transaction.Amount = postTransactionDto.Amount;
            transaction.Category = postTransactionDto.Category;
            transaction.UpdatedAt = DateTime.UtcNow;
            context.Transactions.Update(transaction);
            context.SaveChanges();
        }
        public void Delete(int id)
        {
            var transaction = context.Transactions.Find(id);
            if (transaction == null)
            {
                throw new KeyNotFoundException("Transaction not found");
            }
            context.Transactions.Remove(transaction);
            context.SaveChanges();
        }
    }
}