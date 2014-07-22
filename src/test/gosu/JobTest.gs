uses junit.framework.TestCase
uses jobs.Job
uses jobs.TestJob

class JobTest extends TestCase {

  public function testUpdateSearch() {
    var job = new TestJob()
    job.put('Test', 'Test')
    assertEquals(job.get('Test') as String, 'Test')
  }

  public function testSearchNonExistant() {
    var job = new TestJob()
    assertNull(job.get("Not a field"))
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

  public function testProgress() {
    var job = new TestJob()
    assertEquals("0%", Job.findJob(job.UUId).Progress + "%")
  }

  public function testFindInvalid() {
    assertNull(Job.findJob("Not a value"))
  }

  public function testActiveJobs() {
    var active = Job.ActiveJobs.Count
    var job = new TestJob()
    assertEquals(active + 1, Job.ActiveJobs.Count)
  }

}