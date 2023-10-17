#!/bin/bash

set -e
trap "echo -ne \"\n\n❌ Something went wrong\n\"" ERR

gem install foreman

cd frontend/
npm install
cd ..

cd backend/
bundle install
psql -f db/setup.local.sql
bundle exec rails db:environment:set RAILS_ENV=development
bundle exec rails db:create:all db:schema:load
cd ..

echo -ne "If you need to add some credentials to rails app, please ask a colleague for the master key\n"

echo -ne "\n\n✅ Success\n"
