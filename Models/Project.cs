namespace PortfolioWebsite.Models
{
	public class Project
	{
		public string Name { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public List<string> Technologies { get; set; } = new();
		public string YearRange { get; set; } = string.Empty;
		public List<Link> Links { get; set; } = new();
		public List<ImageInfo> Images { get; set; } = new();

		public class Link
		{
			public string Text { get; set; } = string.Empty;
			public string Url { get; set; } = string.Empty;
		}

		public class ImageInfo
		{
			public string Url { get; set; } = string.Empty;
			public string? Description { get; set; }
			public string Alt { get; set; } = string.Empty;
		}
	}
}
