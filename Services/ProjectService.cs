using PortfolioWebsite.Models;
using System.Text.Json;

namespace PortfolioWebsite.Services
{
	public class ProjectService
	{
		private readonly HttpClient _httpClient;

		public ProjectService(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		public async Task<List<Project>> GetProjectsAsync()
		{
			var response = await _httpClient.GetStringAsync("projects.json");
			return JsonSerializer.Deserialize<List<Project>>(response) ?? new List<Project>();
		}
	}
}
