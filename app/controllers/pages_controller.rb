class PagesController < ApplicationController
  def home
    @identity = Portfolio::Content.identity
    @links = Portfolio::Content.links
    @about = Portfolio::Content.about
    @tech_stack = Portfolio::Content.tech_stack
    @experience = Portfolio::Content.experience
    @skills_categories = Portfolio::Content.skills_categories
    @projects = Portfolio::Content.projects
    @contact_meta = Portfolio::Content.contact
  end

  def resume
    @identity = Portfolio::Content.identity
    @resume = Portfolio::Content.resume
  end

  def project
    @identity = Portfolio::Content.identity
    @projects = Portfolio::Content.projects
    @project = Portfolio::Content.project_by_slug(params[:name])
    @adjacent = Portfolio::Content.adjacent_projects(params[:name])

    return render "pages/project" if @project

    redirect_to root_path, alert: "Project not found."
  end
end
