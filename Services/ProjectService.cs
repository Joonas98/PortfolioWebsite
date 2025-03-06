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
			try
			{
				var request = new HttpRequestMessage(HttpMethod.Get, $"projects.json?t={DateTime.Now.Ticks}");
				request.Headers.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue
				{
					NoCache = true,
					NoStore = true,
					MustRevalidate = true
				};

				var response = await _httpClient.SendAsync(request);
				response.EnsureSuccessStatusCode();

				var json = await response.Content.ReadAsStringAsync();
				var projects = JsonSerializer.Deserialize<List<Project>>(json);

				return projects ?? new List<Project>();
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error loading projects: {ex.Message}");
				return new List<Project>();
			}
		}
	}
}
