namespace Domain
{
    // Activity is a entity
    public class Activity
    {
        // we will generate the guid on client side so that we dont have to wait for server to generate and send it back
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? City { get; set; }
        public string? Venue { get; set; }
        public bool isCancelled { get; set; }

        public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>();
    }
}