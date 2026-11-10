require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "home renders the collection, the about section and the contact form" do
    get root_url
    assert_response :success
    assert_select "#projects [data-reel-item]", count: Portfolio::Content.projects.size
    assert_select "#about"
    assert_select "#contact"
    assert_select "link[rel=canonical][href=?]", "https://sebb.ai/"
    assert_select "script[type='application/ld+json']"
  end

  test "resume renders successfully" do
    get resume_url
    assert_response :success
  end

  test "every project renders as a room with its own metadata" do
    Portfolio::Content.projects.each do |project|
      get project_url(name: project[:slug])

      assert_response :success, "#{project[:slug]} should render"
      assert_select "section.room##{project[:slug]}"
      assert_select "title", text: /#{Regexp.escape(project[:name])}/
      assert_select "meta[name=description][content=?]", project[:description]
      assert_select "link[rel=canonical][href=?]", "https://sebb.ai/projects/#{project[:slug]}"
      assert_select "meta[property='og:image']"
      assert_nil response.headers["Set-Cookie"], "rooms should not set a session cookie"
    end
  end

  test "a room's film renders alone and stays out of search" do
    project = Portfolio::Content.projects.first
    get project_film_url(name: project[:slug])

    assert_response :success
    assert_select "body.film-page section.room"
    assert_select "meta[name=robots][content=noindex]"
  end

  test "unknown project returns not found" do
    get project_url(name: "missing-project")
    assert_response :not_found
  end

  test "retired projects redirect permanently to the collection" do
    get "/projects/billdeck"
    assert_response :moved_permanently
    assert_redirected_to "/#projects"
  end

  test "sitemap lists the home page and every room" do
    get "/sitemap.xml"
    assert_response :success
    assert_includes response.body, "<loc>https://sebb.ai/</loc>"
    Portfolio::Content.projects.each do |project|
      assert_includes response.body, "https://sebb.ai/projects/#{project[:slug]}</loc>"
    end
  end
end
