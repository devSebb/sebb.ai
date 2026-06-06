require "test_helper"

module Portfolio
  # These tests load the real config/content/portfolio.yml (which also runs it
  # through Schema.validate! on load), so they double as a smoke test that the
  # live content file is structurally valid. Assertions are derived from the
  # data where possible so they survive routine content edits.
  class ContentTest < ActiveSupport::TestCase
    setup { Content.reload! }

    test "loads identity data from the content file" do
      assert_equal "Sebb", Content.identity[:nickname]
      assert Content.identity[:name].present?
    end

    test "exposes a non-empty list of projects" do
      assert Content.projects.any?
    end

    test "finds a project by its slug" do
      slug = Content.projects.first[:slug]
      project = Content.project_by_slug(slug)

      assert_not_nil project
      assert_equal slug, project[:slug]
    end

    test "returns nil for an unknown slug" do
      assert_nil Content.project_by_slug("unknown-slug")
    end

    test "adjacent_projects wraps around the list" do
      slugs = Content.projects.map { |p| p[:slug] }
      adjacent = Content.adjacent_projects(slugs.first)

      assert_equal slugs.last, adjacent[:prev][:slug]
      assert_equal slugs.second, adjacent[:next][:slug]
    end

    test "adjacent_projects returns nils for an unknown slug" do
      assert_equal({ prev: nil, next: nil }, Content.adjacent_projects("unknown-slug"))
    end
  end
end
