require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get home" do
    get root_url
    assert_response :success
  end

  test "should get resume" do
    get resume_url
    assert_response :success
  end

  test "should get known project" do
    get project_url(name: "more-xp")
    assert_response :success
  end

  test "unknown project redirects to home" do
    get project_url(name: "missing-project")
    assert_redirected_to root_url
  end
end
