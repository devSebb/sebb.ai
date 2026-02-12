require "test_helper"

module Portfolio
  class ContentTest < ActiveSupport::TestCase
    setup do
      Content.reload!
    end

    test "loads identity data" do
      assert_equal("Sebb", Content.identity[:nickname])
      assert_equal("Sebb Ai", Content.identity[:site_title])
    end

    test "finds project by slug" do
      project = Content.project_by_slug("more-xp")

      assert_not_nil(project)
      assert_equal("More XP", project[:name])
    end

    test "returns nil for unknown slug" do
      assert_nil(Content.project_by_slug("unknown-slug"))
    end
  end
end
