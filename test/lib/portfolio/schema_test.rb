require "test_helper"

module Portfolio
  class SchemaTest < ActiveSupport::TestCase
    # A project hash containing exactly the currently-required keys.
    def valid_project(slug: "demo")
      {
        "slug" => slug,
        "name" => "Demo",
        "tagline" => "A demo project",
        "description" => "Short description",
        "blurb" => "One or two sentences for the home page reel",
        "theme_color" => "#0ED762",
        "theme_bg" => "#0A0A0A",
        "theme_fg" => "#E8E8E8",
        "theme_muted" => "#8A8A86",
        "year" => "2026",
        "role" => "Developer",
        "status" => "live",
        "facts" => [ [ "Stack", "Rails" ] ],
        "fonts" => []
      }
    end

    # A top-level payload containing every required key.
    def valid_payload(projects: [ valid_project ])
      {
        "identity" => {},
        "links" => {},
        "about" => {},
        "tech_stack" => [],
        "experience" => [],
        "practice" => {},
        "projects" => projects,
        "resume" => {},
        "contact" => {}
      }
    end

    test "validates a complete payload" do
      assert Schema.validate!(valid_payload)
    end

    test "raises when required top-level keys are missing" do
      error = assert_raises(ArgumentError) { Schema.validate!({}) }
      assert_match("missing required keys", error.message)
    end

    test "raises when a required project key is missing" do
      payload = valid_payload(projects: [ valid_project.except("blurb") ])
      error = assert_raises(ArgumentError) { Schema.validate!(payload) }
      assert_match("project missing required keys", error.message)
    end

    test "raises when projects is empty" do
      error = assert_raises(ArgumentError) { Schema.validate!(valid_payload(projects: [])) }
      assert_match("non-empty array", error.message)
    end

    test "raises when project slugs are duplicated" do
      payload = valid_payload(projects: [ valid_project(slug: "dup"), valid_project(slug: "dup") ])
      error = assert_raises(ArgumentError) { Schema.validate!(payload) }
      assert_equal("projects slugs must be unique", error.message)
    end

    test "raises when a project slug is blank" do
      payload = valid_payload(projects: [ valid_project(slug: "   ") ])
      error = assert_raises(ArgumentError) { Schema.validate!(payload) }
      assert_match("slug must be present", error.message)
    end
  end
end
