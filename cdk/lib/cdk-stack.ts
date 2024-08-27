import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2.Vpc(this, 'MyVPC', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ]
    });

    // Create a security group
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'Allow SSH (TCP port 22) in',
      allowAllOutbound: true
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH Access')

    // Create an EC2 instance
    const ec2Instance = new ec2.Instance(this, 'EC2Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
      userData: ec2.UserData.custom(`
        #!/bin/bash
        yum update -y
        amazon-linux-extras install docker
        service docker start
        usermod -a -G docker ec2-user
        chkconfig docker on

        # Install Docker Compose
        curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose

        # Create docker-compose.yml
        cat <<EOT > /home/ec2-user/docker-compose.yml
        version: '3.8'

        services:
          app:
            image: tunedindev/tunedinbackend:latest
            ports:
              - "8080:8080"
            environment:
              - SPRING_PROFILES_ACTIVE=local
              - SPRING_DATASOURCE_URL=jdbc:sqlite:/app/tuned_users.db
              - SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.sqlite.JDBC
              - SPRING_JPA_DATABASE_PLATFORM=org.hibernate.community.dialect.SQLiteDialect
              - SPRING_JPA_HIBERNATE_DDL_AUTO=update
              - SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.community.dialect.SQLiteDialect
              - SPRING_JPA_PROPERTIES_HIBERNATE_HBM2DDL_AUTO=update
              - SPRING_JPA_SHOW_SQL=true
              - SPOTIFY_CLIENT_ID=\${SPOTIFY_CLIENT_ID}
              - SPOTIFY_CLIENT_SECRET=\${SPOTIFY_CLIENT_SECRET}
              - SPOTIFY_REDIRECT_URI=\${SPOTIFY_REDIRECT_URI}
              - SPOTIFY_API_BASE_URL=\${SPOTIFY_API_BASE_URL}
            volumes:
              - ./data:/app/data
        EOT

        # Create and run the startup script
        cat <<EOT > /home/ec2-user/start-app.sh
        #!/bin/bash
        # Load environment variables
        source /home/ec2-user/.env
        # Navigate to the directory containing docker-compose.yml
        cd /home/ec2-user
        # Pull the latest image and start the container
        docker-compose pull
        docker-compose up -d
        EOT

        chmod +x /home/ec2-user/start-app.sh

        # Create a placeholder .env file (you'll need to populate this with real values)
        touch /home/ec2-user/.env

        # Create the data directory
        mkdir -p /home/ec2-user/data

        # Run the startup script
        /home/ec2-user/start-app.sh
      `),
      securityGroup: securityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      },
    });

    ec2Instance.connections.allowFromAnyIpv4(ec2.Port.tcp(8080));

    // Output the public IP address
    new cdk.CfnOutput(this, 'InstancePublicIp', {
      value: ec2Instance.instancePublicIp
    });
  }
}