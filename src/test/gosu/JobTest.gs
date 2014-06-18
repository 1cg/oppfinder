uses junit.framework.TestCase
uses jobs.Job

class JobTest extends TestCase {

  public function testUpdateSearch() {
    var job = new TestJob()
    job.update({'Test' -> 'Test'})
    assertEquals(job.search('Test'), 'Test')
  }

  public function testSearchNonExistant() {
    var job = new TestJob()
    assertNull(job.search("Not a field"))
  }

  public function testTypeProperties() {
    var job = new TestJob()
    job.Type = job.IntrinsicType.Name
    assertEquals(job.IntrinsicType.Name, job.Type)
  }

  public function testStartTimeProperties() {
    var job = new TestJob()
    job.StartTime = 1
    assertEquals(1, job.StartTime)
  }

  public function testEndTimeProperties() {
    var job = new TestJob()
    job.EndTime = 1
    assertEquals(1, job.EndTime)
  }

  public function testUUIdProperties() {
    var job = new TestJob()
    job.UUId = 'Foo'
    assertEquals('Foo', job.UUId)
  }

  public function testProgressProperties() {
    var job = new TestJob()
    job.Progress = 1
    assertEquals(1, job.Progress)
  }

  public function testFieldNameProperties() {
    var job = new TestJob()
    job.FieldName = 'Foo'
    assertEquals('Foo', job.FieldName)
  }

  public function testCancelledProperties() {
    var job = new TestJob()
    job.Cancelled = true
    assertTrue(job.Cancelled)
  }

  public function testStatusProperties() {
    var job = new TestJob()
    job.Status = 'Foo'
    assertEquals('Foo', job.Status)
  }

  public function testCancelledJobs() {
    var job = new TestJob()
    var cancelled = Job.CancelledJobs.Count
    job.Cancelled = true
    assertEquals(cancelled + 1, Job.CancelledJobs.Count)
  }

  public function testEndTimeNotDone() {
    var job = new TestJob()
    assertNull(job.EndTime)
  }

  public function testGetUUIdProgress() {
    var job = new TestJob()
    assertEquals("0%", Job.getUUIDProgress(job.UUId))
  }

  public function testGetUUIdProgressInvalid() {
    assertNull(Job.getUUIDProgress("Not a value"))
  }

  public function testActiveJobs() {
    var active = Job.ActiveJobs.Count
    var job = new TestJob()
    assertEquals(active + 1, Job.ActiveJobs.Count)
  }

}