class PagesController < ApplicationController
  def home
    @identity = Portfolio::Content.identity
    @links = Portfolio::Content.links
    @about = Portfolio::Content.about
    @practice = Portfolio::Content.practice
    @tech_stack = Portfolio::Content.tech_stack
    @experience = Portfolio::Content.experience
    @projects = Portfolio::Content.projects
    @contact_meta = Portfolio::Content.contact
    @meta = { structured_data: helpers.person_structured_data(@links) }
  end

  def resume
    @identity = Portfolio::Content.identity
    @resume = Portfolio::Content.resume
    @meta = {
      title: "Resume — devSebb",
      description: "Resume of Sebastian Burke (devSebb): forward deployed engineer and AI solutions engineer. Experience, education and skills.",
      path: resume_path
    }
  end

  # A project page is a "room": its own layout, palette, fonts and scripts.
  def project
    return render_not_found unless load_room

    @meta = {
      title: "#{@project[:name]} — #{@project[:tagline]} · devSebb",
      description: @project[:description],
      path: project_path(@project[:slug]),
      image: "og/#{@project[:slug]}.jpg",
      type: "article",
      structured_data: helpers.project_structured_data(@project)
    }
    cacheable_page
    render "pages/room", layout: "room"
  end

  # The same room reduced to its film, embedded by the home page reel.
  def film
    return render_not_found unless load_room

    cacheable_page
    render "pages/room", layout: "film"
  end

  def sitemap
    @projects = Portfolio::Content.projects
    cacheable_page
    render formats: :xml, layout: false
  end

  private

  def load_room
    @project = Portfolio::Content.project_by_slug(params[:name])
    return false unless @project

    @projects = Portfolio::Content.projects
    @adjacent = Portfolio::Content.adjacent_projects(@project[:slug])
    @position = @projects.index(@project) + 1
    true
  end

  # Rooms carry no forms and no flash, so they skip the session cookie and
  # can be cached by the browser and the edge.
  def cacheable_page
    request.session_options[:skip] = true
    expires_in 10.minutes, public: true
  end

  def render_not_found
    render file: Rails.public_path.join("404.html"), status: :not_found, layout: false
  end
end
