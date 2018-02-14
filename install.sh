#!/bin/sh

ansible-playbook deploy-node.yml -i inventories/sandbox/hosts -e app_name=dgfip-contractualization-front -e app_version=sandbox
ansible-playbook deploy-rails.yml -i inventories/sandbox/hosts -e app_name=dgfip-contractualization-back -e app_version=sandbox
ansible-playbook deploy-rails.yml -i inventories/sandbox/hosts -e app_name=dgfip-contractualization-oauth -e app_version=sandbox
