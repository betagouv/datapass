# -*- mode: ruby -*-
# vi: set ft=ruby :

vms = {
  signup: {
    :ip => '192.168.56.125',
    :memory => '1024',
    :autostart => true,
    :name => 'signup-development',
    :synced_folders =>
      [
        {:host => "./signup-back", :guest => "/opt/apps/signup-back/current"},
        {:host => "./signup-front", :guest => "/opt/apps/signup-front/current"},
        {:host => "./signup-oauth", :guest => "/opt/apps/signup-oauth/current"}
      ],
    :services_to_start =>
      [
        "signup-front",
        "signup-back",
        "signup-oauth"
      ]
  },
  'api-scopes': {
    :ip => '192.168.56.126',
    :memory => '512',
    :autostart => true,
    :name => 'scopes-development',
    :synced_folders =>
      [
        {:host => "./api-scopes", :guest => "/opt/apps/api-scopes/current"}
      ],
    :services_to_start =>
      [
        "api-scopes",
      ]
  }
}

ssh_pubkey = File.read(File.join(Dir.home, '.ssh', 'id_rsa.pub')).chomp

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.provision 'shell', inline: <<-SHELL
    sudo mkdir -p /home/vagrant/.ssh -m 700
    sudo echo '#{ssh_pubkey}' >> /home/vagrant/.ssh/authorized_keys
  SHELL

  # see https://github.com/hashicorp/vagrant/issues/9222
  config.vm.provision 'shell', run: 'always', inline: <<-SHELL
    sudo sed -i '/^auto enp0s3/c\#auto enp0s3/' /etc/network/interfaces
    sudo sed -i '/^iface enp0s3 inet dhcp/c\#iface enp0s3 inet dhcp/' /etc/network/interfaces
    sudo sed -i '/^pre-up sleep 2/c\#pre-up sleep 2/' /etc/network/interfaces
  SHELL

  config.ssh.insert_key = false

  config.vm.provider "virtualbox" do |v|
    v.cpus = 1
    v.gui = false
  end

  vms.each_pair do |key, vm|
    autostart = vm[:autostart]
    config.vm.define key, autostart: autostart do |configvm|

      configvm.vm.network 'private_network', ip: vm[:ip]

      configvm.vm.provider 'virtualbox' do |vb|
        vb.memory = vm[:memory] || '512'
        vb.name = vm[:name]
      end

      vm[:synced_folders].each do |folders|
        configvm.vm.synced_folder folders[:host], folders[:guest], type: "nfs", create: true
      end

      # We need to start the services here as the first start failed because it
      # was triggered before the shared folder are mounted
      vm[:services_to_start].each do |service|
        configvm.trigger.after :up do |trigger|
          trigger.info = "Starting #{service}..."
          trigger.run_remote = {inline: "sudo systemctl start #{service}"}
          # this command will fail on first installation since the service is not configured yet
          # we ignore error for smoother installation
          trigger.on_error = :continue
        end
      end
    end
  end
end
