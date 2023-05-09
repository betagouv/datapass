# frozen_string_literal: true

# Link to the source of this test : How to Rspec You sidekiq-scheduler article
# https://dev.to/pashagray/how-to-rspec-your-sidekiq-scheduler-5hgo

require "rails_helper"
require "fugit"

RSpec.describe "sidekiq-scheduler" do
  sidekiq_file = File.join(Rails.root, "config", "sidekiq.yml")
  schedule = YAML.load_file(sidekiq_file)[:scheduler][:schedule]

  describe "cron syntax" do
    schedule.each do |k, v|
      cron = v["cron"]
      it "#{k} has correct cron syntax" do
        expect { Fugit.do_parse(cron) }.not_to raise_error
      end
    end
  end

  describe "job classes" do
    schedule.each do |k, v|
      klass = v["class"]
      it "#{k} has #{klass} class in /jobs" do
        expect { klass.constantize }.not_to raise_error
      end
    end
  end

  describe "job names" do
    schedule.each do |k, v|
      klass = v["class"]
      it "#{k} has correct name" do
        expect(k).to eq(klass.underscore)
      end
    end
  end
end
