
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Requirements } from './pages/Requirements';
import { DataAnalysis } from './pages/DataAnalysis';
import { ProjectManagement } from './pages/ProjectManagement';
import { Prototyping } from './pages/Prototyping';
import { Courses } from './pages/Courses';
import { Interview } from './pages/Interview';
import { Exam } from './pages/Exam';
import { AiMentor } from './pages/AiMentor';
import { LoginModal } from './components/LoginModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CareerLadderModal } from './components/CareerLadderModal';
import { SkillCategory, User, Order, Certificate } from './types';

// Default Mock User
const DEFAULT_USER: User = {
  name: "Alex",
  email: "alex@pm-master.com",
  avatar: "A",
  level: "Lvl 2",
  role: "产品经理",
  progress: 35,
  examScore: 72,
  certificates: [
    {
      id: 'cert-001',
      levelId: 'l1',
      title: 'Level 1: 产品助理 (APM) 结业证书',
      issueDate: '2023-11-15'
    }
  ]
};

const App: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState<SkillCategory>(SkillCategory.DASHBOARD);
  
  // --- Global State (Lifted) ---
  // Initialize with DEFAULT_USER to simulate a logged-in state by default
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [purchasedLevels, setPurchasedLevels] = useState<string[]>(['l1', 'l2']); // Default unlock L1 & L2 for demo
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-INIT-01',
      itemTitle: '产品经理 (PM) 课程包',
      price: 299,
      date: '2023-10-24',
      status: 'completed'
    }
  ]);
  
  // --- Modals State ---
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);

  // Scroll to top when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSkill]);

  // Mock Actions
  const handleLogin = (username: string) => {
    setUser({
      name: username,
      email: `${username.toLowerCase()}@pm-master.com`,
      avatar: username.charAt(0).toUpperCase(),
      level: 'Lvl 3',
      role: '高级产品经理',
      progress: 12,
      examScore: 85,
      certificates: []
    });
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    setPurchasedLevels(['l1']); // Reset to default
  };

  const handlePurchase = (levelId: string, levelTitle: string, price: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (!purchasedLevels.includes(levelId)) {
      setPurchasedLevels(prev => [...prev, levelId]);
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        itemTitle: `${levelTitle} 课程包`,
        price: price,
        date: new Date().toLocaleDateString(),
        status: 'completed'
      };
      setOrders(prev => [newOrder, ...prev]);
    }
  };

  const handleClaimCertificate = (levelId: string, levelTitle: string) => {
    if (!user) return;
    
    // Check if already claimed
    if (user.certificates.some(c => c.levelId === levelId)) return;

    const newCert: Certificate = {
      id: `CERT-${Date.now()}`,
      levelId,
      title: `${levelTitle} 结业证书`,
      issueDate: new Date().toLocaleDateString()
    };

    setUser({
      ...user,
      certificates: [...user.certificates, newCert]
    });
    
    // Auto show profile to see certificate
    setShowProfileModal(true);
  };

  const renderContent = () => {
    switch (activeSkill) {
      case SkillCategory.DASHBOARD:
        return <Dashboard 
          onNavigate={setActiveSkill} 
          onShowCareerLadder={() => setShowCareerModal(true)}
        />;
      case SkillCategory.COURSES:
        return <Courses 
          purchasedLevels={purchasedLevels} 
          onPurchase={handlePurchase}
          onNavigate={setActiveSkill}
          onClaimCertificate={handleClaimCertificate}
          userCertificates={user?.certificates || []}
        />;
      case SkillCategory.REQUIREMENTS:
        return <Requirements />;
      case SkillCategory.DATA_ANALYSIS:
        return <DataAnalysis />;
      case SkillCategory.PROJECT_MANAGEMENT:
        return <ProjectManagement />;
      case SkillCategory.PROTOTYPING:
        return <Prototyping />;
      case SkillCategory.INTERVIEW:
        return <Interview />;
      case SkillCategory.EXAM:
        return <Exam />;
      case SkillCategory.AI_MENTOR:
        return <AiMentor />;
      default:
        return <Dashboard 
          onNavigate={setActiveSkill} 
          onShowCareerLadder={() => setShowCareerModal(true)}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans">
      <Header 
        activeSkill={activeSkill} 
        onNavigate={setActiveSkill} 
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
        onProfileClick={() => setShowProfileModal(true)}
      />
      
      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 animate-fade-in">
        {renderContent()}
      </main>

      {/* Global Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLogin} 
      />
      
      {user && (
        <UserProfileModal 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)} 
          user={user}
          orders={orders}
          onLogout={handleLogout}
          onShowCareerLadder={() => setShowCareerModal(true)}
        />
      )}

      <CareerLadderModal 
        isOpen={showCareerModal} 
        onClose={() => setShowCareerModal(false)}
        currentLevel={user ? user.level : 'Lvl 1'}
      />
    </div>
  );
};

export default App;
