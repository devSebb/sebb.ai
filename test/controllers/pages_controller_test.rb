require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "home renders successfully with the contact section" do
    get root_url
    assert_response :success
    assert_select "#contact"
  end

  test "resume renders successfully" do
    get resume_url
    assert_response :success
  end

  test "known project renders its detail page" do
    project = Portfolio::Content.projects.first
    get project_url(name: project[:slug])

    assert_response :success
    assert_select "h1.project-detail-title", text: /#{Regexp.escape(project[:name])}/
  end

  test "unknown project redirects home with an alert" do
    get project_url(name: "missing-project")

    assert_redirected_to root_url
    assert_equal "Project not found.", flash[:alert]
  end
end
