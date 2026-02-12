require "test_helper"

module Portfolio
  class SchemaTest < ActiveSupport::TestCase
    test "validates a complete payload" do
      data = {
        "identity" => {},
        "links" => {},
        "about" => {},
        "tech_icons" => {},
        "tech_stack" => [],
        "experience" => [],
        "specializations" => [],
        "projects" => [
          {
            "slug" => "demo",
            "name" => "Demo",
            "url" => "https://example.com",
            "description" => "desc",
            "image" => "image.png",
            "detailed_description" => "details",
            "features" => [],
            "technologies" => []
          }
        ],
        "resume" => {},
        "contact" => {}
      }

      assert Schema.validate!(data)
    end

    test "raises when required top-level keys are missing" do
      error = assert_raises(ArgumentError) { Schema.validate!({}) }
      assert_match("missing required keys", error.message)
    end

    test "raises when project slugs are duplicated" do
      data = {
        "identity" => {},
        "links" => {},
        "about" => {},
        "tech_icons" => {},
        "tech_stack" => [],
        "experience" => [],
        "specializations" => [],
        "projects" => [
          {
            "slug" => "dup",
            "name" => "Demo",
            "url" => "https://example.com",
            "description" => "desc",
            "image" => "image.png",
            "detailed_description" => "details",
            "features" => [],
            "technologies" => []
          },
          {
            "slug" => "dup",
            "name" => "Demo 2",
            "url" => "https://example.com",
            "description" => "desc2",
            "image" => "image2.png",
            "detailed_description" => "details2",
            "features" => [],
            "technologies" => []
          }
        ],
        "resume" => {},
        "contact" => {}
      }

      error = assert_raises(ArgumentError) { Schema.validate!(data) }
      assert_equal("projects slugs must be unique", error.message)
    end
  end
end
