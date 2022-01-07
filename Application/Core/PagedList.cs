

using System;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T> : List<T>
    {
        public PagedList(IEnumerable<T> items, int count, int itemsPerPage, int pageNumber)
        {
            CurrentPage = pageNumber;
            ItemsPerPage = itemsPerPage;
            TotalPages = (int)Math.Ceiling(count / (double)itemsPerPage);
            TotalItems = count;

            // List data
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, count, pageSize, pageNumber);

        }
    }
}