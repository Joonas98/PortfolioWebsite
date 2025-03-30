namespace PortfolioWebsite.Models
{
	public class Project
	{
		public string Name { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public List<string> Technologies { get; set; } = new();
		public string YearRange { get; set; } = string.Empty;
		public string RepoUrl { get; set; } = string.Empty; // Optional GitHub link
		public string OtherLink { get; set; } = string.Empty; // Optional link to other site
		public List<string> ImageUrls { get; set; } = new();
	}
}
