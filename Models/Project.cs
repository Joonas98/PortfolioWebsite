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

		// Folder of images for each project, get those automatically
		public string? ImageFolder { get; set; }

		public class Link
		{
			public string Text { get; set; } = string.Empty;
			public string Url { get; set; } = string.Empty;
		}

		public class ImageInfo
		{
			public string Url { get; set; } = string.Empty;
			public string Alt { get; set; } = string.Empty;
		}
	}
}
