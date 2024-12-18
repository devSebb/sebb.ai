class PagesController < ApplicationController
  def home
  end

  def resume
  end

  def project
    @techstack = {
      "fab fa-react" => "techstack/api_icon.png",
      "fab fa-ruby" => "techstack/ruby_logo.png",
      "fas fa-train" => "techstack/ruby_logo.png",
      "fas fa-database" => "techstack/ruby_logo.png",
      "fab fa-python" => "techstack/ruby_logo.png",
      "fab fa-js" => "techstack/ruby_logo.png",
      "fab fa-aws" => "techstack/ruby_logo.png",
      "fas fa-brain" => "techstack/ruby_logo.png",
      "fab fa-html5" => "techstack/ruby_logo.png",
      "fab fa-css3" => "techstack/ruby_logo.png",
      "fab fa-stripe" => "techstack/ruby_logo.png"
    }

    @projects = {
      "more-xp" => {
        name: "More XP",
        url: "https://morexp.example.com",
        description: "Revolutionizing the job market: Pay for experiences, boost your resume, land your dream job!",
        image: "more_XP_index.png",
        detailed_description: "More XP is a revolutionary platform that connects job seekers with valuable work experiences. Users can purchase real-world experience opportunities, build their resumes, and increase their chances of landing their dream jobs. The platform features a sophisticated matching algorithm and secure payment processing.",
        features: [
          "AI-powered experience matching",
          "Secure payment processing",
          "Interactive user profiles",
          "Review and rating system"
        ],
        technologies: [
          { icon: "fab fa-react", color: "#61DAFB" },
          { icon: "fab fa-ruby", color: "#CC342D" },
          { icon: "fas fa-train", color: "#CC0000" },
          { icon: "fas fa-database", color: "#4299E1" }
        ]
      },
      "make-me-fit" => {
        name: "Make-Me-Fit",
        url: "https://makemefit.example.com",
        description: "AI-powered meal planning tailored to your fitness goals and dietary needs",
        image: "MMF_Home.png",
        detailed_description: "Make-Me-Fit leverages artificial intelligence to create personalized meal plans that align with users' specific fitness goals and dietary requirements. The application considers factors such as allergies, preferences, and nutritional needs to generate comprehensive weekly meal plans with shopping lists and recipes.",
        features: [
          "AI-generated meal plans",
          "Customizable dietary preferences",
          "OpenAi Integration",
          "GSAP Animated"
        ],
        technologies: [
          { icon: "fab fa-python", color: "#3776AB" },
          { icon: "fab fa-js", color: "#F7DF1E" },
          { icon: "fab fa-aws", color: "#FF9900" },
          { icon: "fas fa-brain", color: "#FF4088" }
        ]
      },
      "domo-kanban" => {
        name: "Domo Kanban Board",
        url: "https://domokanban.example.com",
        description: "Streamline your workflow with our Rails-powered Kanban board for task and goal tracking!",
        image: "Domo_Kanban.png",
        detailed_description: "Domo Kanban Board is a powerful project management tool built with Ruby on Rails. It offers intuitive task management with drag-and-drop functionality, real-time updates, team collaboration features, and customizable workflows to help teams stay organized and productive.",
        features: [
          "Drag-and-drop task management",
          "Real-time collaboration",
          "Customizable workflows",
          "Team progress analytics"
        ],
        technologies: [
          { icon: "fab fa-ruby", color: "#CC342D" },
          { icon: "fas fa-train", color: "#CC0000" },
          { icon: "fab fa-js", color: "#F7DF1E" },
          { icon: "fab fa-html5", color: "#E34F26" }
        ]
      },
      "arabella-rock" => {
        name: "Arabella Rock & Roll Store",
        url: "https://arabellarock.example.com",
        description: "Rock & Roll themed e-commerce site for musical instruments, powered by Rails and Stripe",
        image: "Arabella_index.png",
        detailed_description: "Arabella Rock & Roll Store is a full-featured e-commerce platform specializing in musical instruments. Built with Ruby on Rails and integrated with Stripe for secure payments, the store offers a wide selection of instruments, equipment, and accessories with a unique rock & roll aesthetic.",
        features: [
          "Secure Stripe integration",
          "Product inventory management",
          "Customer reviews system",
          "Cloudinary Integration"
        ],
        technologies: [
          { icon: "fab fa-ruby", color: "#CC342D" },
          { icon: "fas fa-train", color: "#CC0000" },
          { icon: "fab fa-stripe", color: "#008CDD" },
          { icon: "fab fa-css3", color: "#2965F1" }
        ]
      }
    }

    @project = @projects[params[:name]]
    render "pages/project"
  end
end
